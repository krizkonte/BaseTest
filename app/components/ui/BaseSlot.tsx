import * as React from "react";

/* -------------------------------------------------------------------------------------------------
 * Utilities
 * -----------------------------------------------------------------------------------------------*/

// Compõe múltiplas refs de forma segura (React 19+)
function composeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        // React 19+: ref objects são agora apenas { current }
        try {
          (ref as { current: T | null }).current = node;
        } catch {}
      }
    }
  };
}

// Merge inteligente de props (inspirado no Radix)
type AnyProps = Record<string, any>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const mergedProps = { ...childProps };

  for (const propName in childProps) {
    const slotValue = slotProps[propName];
    const childValue = childProps[propName];

    // Event handlers - compõe ambos
    if (
      /^on[A-Z]/.test(propName) &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      mergedProps[propName] = (...args: unknown[]) => {
        // Child executa primeiro, depois slot
        const childResult = childValue(...args);
        slotValue(...args);
        return childResult;
      };
    }
    // Style - merge objetos
    else if (
      propName === "style" &&
      typeof slotValue === "object" &&
      typeof childValue === "object"
    ) {
      mergedProps[propName] = { ...slotValue, ...childValue };
    }
    // ClassName - concatena strings
    else if (propName === "className") {
      const classNames = [slotValue, childValue].filter(Boolean);
      mergedProps[propName] =
        classNames.length > 0 ? classNames.join(" ") : undefined;
    }
    // data-* attributes - child prevalece, mas preserva slot se child não tiver
    else if (propName.startsWith("data-")) {
      mergedProps[propName] = childValue ?? slotValue;
    }
  }

  // Adiciona props do slot que não existem no child
  for (const propName in slotProps) {
    if (!(propName in childProps)) {
      mergedProps[propName] = slotProps[propName];
    }
  }

  return mergedProps;
}

// Extrai ref de forma compatível (React 19+)
function getElementRef(
  element: React.ReactElement
): React.Ref<any> | undefined {
  // React 19: ref está sempre em props.ref
  return (element.props as any).ref;
}

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const SLOTTABLE_ID = Symbol("slot.slottable");

interface SlottableProps {
  children: React.ReactNode;
}

interface SlottableComponent extends React.FC<SlottableProps> {
  __slotId: symbol;
}

const Slottable: SlottableComponent = ({ children }) => {
  return <>{children}</>;
};

Slottable.__slotId = SLOTTABLE_ID;
Slottable.displayName = "Slottable";

function isSlottable(
  child: React.ReactNode
): child is React.ReactElement<SlottableProps> {
  return (
    React.isValidElement(child) &&
    typeof child.type === "function" &&
    "__slotId" in child.type &&
    (child.type as SlottableComponent).__slotId === SLOTTABLE_ID
  );
}

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

type SlotProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
};

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, asChild = true, ...slotProps } = props;

  // Se asChild é false, renderiza wrapper normal
  if (!asChild) {
    return (
      <div ref={forwardedRef as React.Ref<HTMLDivElement>} {...slotProps}>
        {children}
      </div>
    );
  }

  // Converte children em array para processamento
  const childrenArray = React.Children.toArray(children);

  // Procura por Slottable nos filhos
  const slottableChild = childrenArray.find(isSlottable);

  if (slottableChild) {
    // Caso complexo: temos um Slottable
    let slottableContent: unknown = undefined;
    if (React.isValidElement(slottableChild)) {
      slottableContent = slottableChild.props.children;
    }

    // Remove o Slottable dos children e substitui pelo seu conteúdo
    const newChildren = childrenArray.map((child) => {
      if (child === slottableChild) {
        // Se o conteúdo do Slottable tem múltiplos filhos, retorna eles em um Fragment
        if (React.Children.count(slottableContent) > 1) {
          return (
            <React.Fragment>
              {slottableContent as React.ReactNode}
            </React.Fragment>
          );
        }
        // Se é um elemento único, retorna seus filhos para evitar wrapper extra
        if (React.isValidElement(slottableContent)) {
          return (slottableContent as React.ReactElement<any, any>).props
            .children;
        }
        return slottableContent as React.ReactNode;
      }
      return child;
    });

    // Se o conteúdo do Slottable é um elemento válido, usa ele como target
    if (React.isValidElement(slottableContent)) {
      const element = slottableContent as React.ReactElement<any, any>;
      const elementRef = getElementRef(element);
      const mergedProps = mergeProps(slotProps, element.props);

      // Compõe refs se não for Fragment
      if (element.type !== React.Fragment) {
        mergedProps.ref = forwardedRef
          ? composeRefs(forwardedRef, elementRef)
          : elementRef;
      }

      return React.cloneElement(element, mergedProps, newChildren);
    }

    // Se não é um elemento válido, renderiza wrapper com conteúdo
    return (
      <div ref={forwardedRef as React.Ref<HTMLDivElement>} {...slotProps}>
        {newChildren}
      </div>
    );
  }

  // Caso simples: sem Slottable, processa primeiro filho válido
  const firstChild = childrenArray.find(
    React.isValidElement
  ) as React.ReactNode;

  if (!firstChild) {
    // Sem filhos válidos, renderiza wrapper vazio
    return (
      <div ref={forwardedRef as React.Ref<HTMLDivElement>} {...slotProps}>
        {children}
      </div>
    );
  }

  // Se há apenas um filho e é um elemento, aplica slot pattern
  if (childrenArray.length === 1 && React.isValidElement(firstChild)) {
    const element = firstChild as React.ReactElement<any, any>;
    const elementRef = getElementRef(element);
    const mergedProps = mergeProps(slotProps, element.props);

    // Não passa ref para Fragment
    if (element.type !== React.Fragment) {
      mergedProps.ref = forwardedRef
        ? composeRefs(forwardedRef, elementRef)
        : elementRef;
    }

    return React.cloneElement(element, mergedProps);
  }

  // Múltiplos filhos sem Slottable - renderiza wrapper
  return (
    <div ref={forwardedRef as React.Ref<HTMLDivElement>} {...slotProps}>
      {children}
    </div>
  );
});

Slot.displayName = "Slot";

/* -------------------------------------------------------------------------------------------------
 * Hook para uso dinâmico
 * -----------------------------------------------------------------------------------------------*/

interface UseSlotOptions {
  asChild?: boolean;
  fallback?: string; // string cobre todos os elementos nativos
}

function useSlot(options: UseSlotOptions = {}) {
  const { asChild = false, fallback = "div" } = options;

  return React.useMemo(
    () =>
      ({ children, ...props }: SlotProps) => {
        if (asChild) {
          return <Slot {...props}>{children}</Slot>;
        }

        const Component = fallback;
        return React.createElement(Component, props, children);
      },
    [asChild, fallback]
  );
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

export { Slot, Slottable, useSlot };
export type { SlotProps, SlottableProps };

/* -------------------------------------------------------------------------------------------------
 * Exemplos de uso
 * -----------------------------------------------------------------------------------------------*/

/*
// 1. Uso básico - substitui o elemento filho
<Slot onClick={handleClick} className="button-style">
  <button>Click me</button>
</Slot>
// Resultado: <button onClick={handleClick} className="button-style">Click me</button>

// 2. Composição de event handlers
<Slot onClick={() => console.log('slot')} className="extra">
  <button onClick={() => console.log('child')} className="original">
    Click me
  </button>
</Slot>
// Resultado: onClick executa ambos (child primeiro, depois slot)
// className: "original extra"

// 3. Múltiplos filhos sem slot behavior
<Slot asChild={false} className="wrapper">
  <span>First</span>
  <span>Second</span>
</Slot>
// Resultado: <div className="wrapper"><span>First</span><span>Second</span></div>

// 4. Composição complexa com Slottable
<Slot onClick={handleClick} className="button-wrapper">
  <div className="container">
    <Slottable>
      <button className="actual-button">Target</button>
    </Slottable>
    <span className="extra">Extra content</span>
  </div>
</Slot>
// Resultado: O button recebe as props do Slot, mas o span é preservado

// 5. Uso com hook dinâmico
const DynamicSlot = useSlot({ asChild: true, fallback: 'span' });
<DynamicSlot onClick={handleClick}>
  <button>Dynamic</button>
</DynamicSlot>

// 6. Merge de estilos
<Slot style={{ color: 'red' }} className="slot-class">
  <div style={{ backgroundColor: 'blue' }} className="child-class">
    Content
  </div>
</Slot>
// Resultado: style={{ color: 'red', backgroundColor: 'blue' }} 
//           className="child-class slot-class"
*/
