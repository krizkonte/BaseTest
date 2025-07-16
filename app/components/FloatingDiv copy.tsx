import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { VARS } from "./PaletteCustomizer";

interface FloatingDivProps {
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  className?: string;
}

export default function FloatingDiv({
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 300, height: 200 },
  minSize = { width: 150, height: 100 },
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

  // Switch para exibir só o modo atual ou ambos
  const [showBoth, setShowBoth] = useState(false);
  // Detecta modo atual
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );
  useEffect(() => {
    const handler = () =>
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    window.addEventListener("themeChange", handler);
    return () => window.removeEventListener("themeChange", handler);
  }, []);

  // Função para pegar a cor computada de uma variável CSS
  function getVarColor(varName: string) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  // Renderiza a grade de um modo
  function PaletteGrid({ mode }: { mode: "light" | "dark" }) {
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
                <span
                  key={v}
                  title={v}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: getVarColor(v),
                    border: "1px solid #333",
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const divRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
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
  };

  const handleMouseMove = (e: MouseEvent) => {
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
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
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
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const floatingDiv = (
    <div
      ref={divRef}
      className={`floater elevation-high border border-surface rounded-md shadow-lg ${className}`}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 1000,
        cursor: isDragging ? "grabbing" : "default",
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
          />
        </div>
      </div>

      {/* Switcher para exibir modo atual ou ambos */}
      <div className="flex items-center gap-2 p-2">
        <label className="text-xs">Exibir ambos os modos</label>
        <input
          type="checkbox"
          checked={showBoth}
          onChange={(e) => setShowBoth(e.target.checked)}
        />
      </div>

      {/* Grade da paleta */}
      <div className="p-2 overflow-x-auto">
        {showBoth ? (
          <>
            <PaletteGrid mode="light" />
            <PaletteGrid mode="dark" />
          </>
        ) : (
          <PaletteGrid mode={theme} />
        )}
      </div>

      {/* Content */}
      <div
        className="p-4 overflow-auto"
        style={{ height: "calc(100% - 48px)" }}
      >
        {children}
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
