import { useRef, useEffect, useCallback, useMemo } from "react";
import type { RefObject, Ref } from "react";

// Utilitário para compor múltiplos refs (padrão do BaseSlot)
function composeRefs<T>(...refs: (Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        try {
          (ref as { current: T | null }).current = node;
        } catch {}
      }
    }
  };
}

export function useForceActive<T extends HTMLElement = HTMLElement>(
  duration = 150,
  externalRef?: Ref<T | null>,
  externalHandlers?: Record<string, (e: any) => void>
): [RefObject<T | null>, Record<string, (e: any) => void>] {
  const ref = useRef<T | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const safeDuration = Math.max(0, duration);

  const activate = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.setAttribute("data-force-active", "true");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        el.removeAttribute("data-force-active");
      }, safeDuration);
    }
  }, [safeDuration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const el = ref.current;
      if (el) el.removeAttribute("data-force-active");
    };
  }, []);

  // Compor refs se externo for fornecido
  const composedRef = useMemo(() => {
    if (externalRef) return composeRefs(ref, externalRef);
    return ref;
  }, [externalRef]);

  // Combinar handlers internos com externos
  const handlers = useMemo(() => {
    const baseHandlers = {
      onMouseDown: activate,
    };

    if (!externalHandlers) return baseHandlers;

    return {
      ...baseHandlers,
      ...Object.fromEntries(
        Object.entries(externalHandlers).map(([key, handler]) => [
          key,
          (e: any) => {
            // Sempre executa o handler interno primeiro
            if (key === "onMouseDown") {
              activate();
            }
            // Depois executa o handler externo
            handler(e);
          },
        ])
      ),
    };
  }, [activate, externalHandlers]);

  // Retorna o ref composto para uso no componente
  return [composedRef as RefObject<T | null>, handlers];
}
