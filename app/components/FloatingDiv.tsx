import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { VARS } from "./PaletteCustomizer";
import { parse as parseColor } from "culori";
import { oklch, formatCss } from "culori";

interface FloatingDivProps {
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  className?: string;
}

// Interface para valores editados manualmente
interface ManualValues {
  [varName: string]: {
    L: number;
    C: number;
    enabled: boolean;
  };
}

export default function FloatingDiv({
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 450, height: 350 },
  minSize = { width: 250, height: 200 },
  className = "",
}: FloatingDivProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Estado para valores editados manualmente - SIMPLIFICADO
  const [manualValues, setManualValues] = useState<ManualValues>({});

  // Detecta modo atual
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });

  // Detecta se está no tema custom
  const [isCustomTheme, setIsCustomTheme] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.getAttribute("data-brand") === "custom";
  });

  // Observa mudanças na classe do html para detectar troca de tema
  useEffect(() => {
    const handler = () => {
      const newTheme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      setTheme(newTheme);
    };

    const customHandler = () => {
      const isCustom =
        document.documentElement.getAttribute("data-brand") === "custom";
      setIsCustomTheme(isCustom);

      // Se saiu do custom, limpa os valores manuais
      if (!isCustom) {
        clearManualValuesOnExit();
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "class") {
            handler();
          } else if (mutation.attributeName === "data-brand") {
            customHandler();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-brand"],
    });

    window.addEventListener("themeChange", handler);
    window.addEventListener("brandChange", customHandler);

    return () => {
      observer.disconnect();
      window.removeEventListener("themeChange", handler);
      window.removeEventListener("brandChange", customHandler);
    };
  }, []);

  // Função para pegar a cor computada de uma variável CSS
  const getVarColor = useCallback((varName: string) => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const color = computedStyle.getPropertyValue(varName).trim();

    if (!color) {
      return "oklch(0.5 0 0)"; // cinza médio como fallback
    }

    return color;
  }, []);

  // Função para converter cor CSS para valores L e C usando culori
  const getColorValues = useCallback((cssColor: string) => {
    const parsed = parseColor(cssColor);
    if (parsed && parsed.mode === "oklch") {
      const L = Math.round(parsed.l * 100);
      const C = Math.round(parsed.c * 100);
      return { L, C };
    }
    return { L: 0, C: 0 };
  }, []);

  // Função para aplicar valores editados manualmente
  const applyManualValues = useCallback(() => {
    const root = document.documentElement;

    Object.entries(manualValues).forEach(([varName, values]) => {
      if (values.enabled) {
        const originalColor = getVarColor(varName);
        const parsed = parseColor(originalColor);

        const L = Math.max(0, Math.min(1, values.L / 100));
        const C = Math.max(0, Math.min(1, values.C / 100));
        const H = parsed && parsed.mode === "oklch" ? parsed.h : 0;

        const color = oklch({ l: L, c: C, h: H, mode: "oklch" });
        const cssColor = formatCss(color);

        root.style.setProperty(varName, cssColor);
      }
    });
  }, [manualValues, getVarColor]);

  // Aplica valores manuais quando mudam
  useEffect(() => {
    applyManualValues();
  }, [applyManualValues]);

  // Escuta mudanças do PaletteCustomizer para manter sincronização
  useEffect(() => {
    const handlePaletteChange = () => {
      // Força re-renderização quando o PaletteCustomizer muda as cores
      setManualValues((prev) => ({ ...prev }));
    };

    window.addEventListener("paletteChange", handlePaletteChange);
    window.addEventListener("colorChange", handlePaletteChange);

    return () => {
      window.removeEventListener("paletteChange", handlePaletteChange);
      window.removeEventListener("colorChange", handlePaletteChange);
    };
  }, []);

  // Função para atualizar valor manual - SIMPLIFICADA
  const updateManualValue = useCallback(
    (
      varName: string,
      field: "L" | "C" | "enabled",
      value: number | boolean
    ) => {
      setManualValues((prev) => {
        const currentValues = prev[varName] || {};

        if (field === "enabled" && value === true && !currentValues.enabled) {
          const currentColor = getVarColor(varName);
          const { L, C } = getColorValues(currentColor);

          return {
            ...prev,
            [varName]: {
              ...currentValues,
              L: L,
              C: C,
              enabled: true,
            },
          };
        }

        return {
          ...prev,
          [varName]: {
            ...currentValues,
            [field]: value,
          },
        };
      });
    },
    [getColorValues, getVarColor]
  );

  // Função para limpar todos os valores manuais
  const clearManualValues = useCallback(() => {
    setManualValues({});
    const root = document.documentElement;
    Object.keys(manualValues).forEach((varName) => {
      root.style.removeProperty(varName);
    });
  }, [manualValues]);

  // Função para limpar valores manuais quando sair do custom
  const clearManualValuesOnExit = useCallback(() => {
    setManualValues({});
    const root = document.documentElement;
    Object.values(VARS)
      .flat()
      .forEach((varName) => {
        root.style.removeProperty(varName);
      });
  }, []);

  // Componente simples para o quadrado de cor
  const ColorSquare = ({ varName }: { varName: string }) => {
    const color = getVarColor(varName);
    const { L, C } = getColorValues(color);
    const manualValue = manualValues[varName];
    const isManualEnabled = manualValue?.enabled || false;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          title={varName}
          style={{
            width: 72,
            height: 72,
            maxWidth: 72,
            maxHeight: 72,
            borderRadius: 4,
            background: color,
            border: "1px solid #333",
            display: "inline-block",
          }}
        />

        {!isManualEnabled && (
          <div style={{ fontSize: 10, textAlign: "center", marginTop: 2 }}>
            <div>L: {L}</div>
            <div>C: {C}</div>
          </div>
        )}

        {isCustomTheme && (
          <div style={{ marginTop: 4, fontSize: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="checkbox"
                checked={isManualEnabled}
                onChange={(e) =>
                  updateManualValue(varName, "enabled", e.target.checked)
                }
                style={{ width: 8, height: 8 }}
              />
              <span>Manual</span>
            </label>
          </div>
        )}
      </div>
    );
  };

  // Componente simples para controles de valores
  const ValueControls = ({ varName }: { varName: string }) => {
    const manualValue = manualValues[varName];
    const isManualEnabled = manualValue?.enabled || false;

    if (!isManualEnabled) return null;

    const [tempL, setTempL] = useState(manualValue?.L ?? 0);
    const [tempC, setTempC] = useState(manualValue?.C ?? 0);

    // Atualiza os valores temporários quando manualValue muda ou quando há mudanças do PaletteCustomizer
    useEffect(() => {
      // Pega os valores atuais da cor para sincronizar
      const currentColor = getVarColor(varName);
      const { L, C } = getColorValues(currentColor);

      setTempL(L);
      setTempC(C);
    }, [manualValue?.L, manualValue?.C, varName, getVarColor, getColorValues]);

    const handleApply = () => {
      // Aplica diretamente no DOM primeiro
      const root = document.documentElement;
      const originalColor = getVarColor(varName);
      const parsed = parseColor(originalColor);

      const L = Math.max(0, Math.min(1, tempL / 100));
      const C = Math.max(0, Math.min(1, tempC / 100));
      const H = parsed && parsed.mode === "oklch" ? parsed.h : 0;

      const color = oklch({ l: L, c: C, h: H, mode: "oklch" });
      const cssColor = formatCss(color);

      root.style.setProperty(varName, cssColor);

      // Depois atualiza o estado
      setManualValues((prev) => ({
        ...prev,
        [varName]: {
          ...prev[varName],
          L: tempL,
          C: tempC,
          enabled: true,
        },
      }));
    };

    return (
      <div
        style={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 8, width: 12 }}>L:</span>
            <input
              type="number"
              min="-20"
              max="20"
              value={tempL}
              onChange={(e) => setTempL(Number(e.target.value))}
              style={{
                width: 30,
                height: 16,
                fontSize: 8,
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 8, width: 12 }}>C:</span>
            <input
              type="number"
              min="-20"
              max="20"
              value={tempC}
              onChange={(e) => setTempC(Number(e.target.value))}
              style={{
                width: 30,
                height: 16,
                fontSize: 8,
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
        <button
          onClick={handleApply}
          style={{
            fontSize: 6,
            padding: "2px 4px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 2,
            cursor: "pointer",
          }}
          title="Aplicar valores"
        >
          Aplicar
        </button>
      </div>
    );
  };

  // Renderiza a grade de um modo - SIMPLIFICADA
  const PaletteGrid = ({ mode }: { mode: "light" | "dark" }) => {
    return (
      <div className="mb-4">
        <div className="font-bold text-xs mb-1">
          {mode === "light" ? "☀️ Light" : "🌑 Dark"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(VARS).map(([group, vars]) => (
            <div
              key={group}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span style={{ width: 60, fontSize: 12 }}>{group}</span>
              {vars.map((v) => (
                <div
                  key={`${mode}-${v}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ColorSquare varName={v} />
                  <ValueControls varName={v} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const divRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === headerRef.current) {
      setIsDragging(true);
      const rect = divRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (isResizing) {
        const newWidth = Math.max(
          minSize.width,
          e.clientX - resizeStart.x + resizeStart.width
        );
        const newHeight = Math.max(
          minSize.height,
          e.clientY - resizeStart.y + resizeStart.height
        );
        setSize({ width: newWidth, height: newHeight });
      }
    },
    [isDragging, isResizing, dragOffset, resizeStart, minSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    const rect = divRef.current?.getBoundingClientRect();
    if (rect) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const floatingDiv = (
    <div
      ref={divRef}
      className={`floater elevation-high border border-surface rounded-md shadow-lg flex flex-col ${className}`}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 1000,
        cursor: isDragging ? "grabbing" : "default",
        minHeight: 0,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header for dragging */}
      <div
        ref={headerRef}
        className="flex items-center justify-between p-3 border-b border-surface cursor-grab active:cursor-grabbing"
        style={{ userSelect: "none" }}
      >
        <div className="text-sm font-medium">Div Flutuante</div>
        <div className="flex gap-1">
          <button
            className="w-2 h-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            onClick={() => divRef.current?.remove()}
            title="Fechar"
          />
          <button
            className="w-2 h-2 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            onClick={clearManualValues}
            title="Limpar valores manuais"
          />
        </div>
      </div>

      {/* Grade da paleta */}
      <div className="flex-1 p-2 overflow-auto" style={{ minHeight: 0 }}>
        <PaletteGrid mode={theme} />
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
        style={{
          background:
            "linear-gradient(-45deg, transparent 30%, var(--surface-border) 30%, var(--surface-border) 70%, transparent 70%)",
        }}
      />
    </div>
  );

  return createPortal(floatingDiv, document.body);
}
