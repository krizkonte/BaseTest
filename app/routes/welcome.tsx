import React from "react";
import BaseButton from "../components/base/BaseButton";
import BasePopover from "../components/base/BasePopover";

// Definindo os tipos para as props do ExampleContent
interface ExampleContentProps {
  title?: string;
  showButtons?: boolean;
  showLink?: boolean;
  fullText?: boolean;
}

// Componente para agrupar os botões
const ButtonGroup = ({
  variant = "default",
  disabled = false,
  withPopover = false,
  hideDefault = false,
}) => {
  const buttonProps = disabled ? { disabled: true } : {};

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex gap-2">
        {!hideDefault && <BaseButton {...buttonProps}>Default</BaseButton>}
        <BaseButton variant="outline" {...buttonProps}>
          Outline
        </BaseButton>
        <BaseButton variant="ghost" {...buttonProps}>
          Ghost
        </BaseButton>
        {withPopover && <BasePopover />}
      </div>
      {variant === "default" && (
        <div className="flex gap-2">
          <BaseButton variant="danger" {...buttonProps}>
            Danger
          </BaseButton>
          <BaseButton variant="ghostDanger" {...buttonProps}>
            Ghost Danger
          </BaseButton>
        </div>
      )}
      {variant === "default" && (
        <div className="flex gap-2">
          <BaseButton disabled>Disabled</BaseButton>
          <BaseButton disabled variant="ghost">
            Ghost Disabled
          </BaseButton>
          <BaseButton disabled variant="ghostDanger">
            Ghost Danger Disabled
          </BaseButton>
        </div>
      )}
    </div>
  );
};

// Componente para o conteúdo padrão de exemplo
const ExampleContent: React.FC<ExampleContentProps> = ({
  title,
  showButtons = true,
  fullText = true,
}) => (
  <>
    {title && <strong>{title}</strong>}
    <p className="text-default">Texto padrão</p>
    <p className="text-secondary">Texto secundário</p>
    {fullText && <p className="text-tertiary">Texto terciário</p>}
    <p className="text-disabled">Texto desabilitado</p>
    {fullText && (
      <>
        <p className="text-success">Operação realizada com sucesso!</p>
        <p className="text-error">Ocorreu um erro.</p>
        <p className="text-info">Sou uma informação relevante</p>
        <p className="text-warning">Sou um aviso urgente!</p>
      </>
    )}
    {fullText && (
      <a href="#" className="text-link">
        Clique aqui para ver o link
      </a>
    )}
  </>
);

// Definindo os tipos para as props do Surface
interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "inverted"
    | "high"
    | "low"
    | "accent"
    | "danger"
    | "success"
    | "info"
    | "warning";
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

// Componente de superfície reutilizável
const Surface: React.FC<SurfaceProps> = ({
  variant = "default",
  title,
  description,
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "surface p-4 rounded shadow";
  const variantClass = variant !== "default" ? ` ${variant}` : "";
  const classes = `${baseClasses}${variantClass} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {title && <strong>{title}</strong>}
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};

export function Welcome() {
  // Estado para o tema atual
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(() => {
    if (document.documentElement.classList.contains("dark")) return "dark";
    if (document.documentElement.classList.contains("light")) return "light";
    return "system";
  });

  // Atualiza o tema conforme o estado e escuta mudanças do sistema se "system"
  React.useEffect(() => {
    const applyTheme = (t: "light" | "dark" | "system") => {
      document.documentElement.classList.remove("light", "dark");
      if (t === "light") {
        document.documentElement.classList.add("light");
      } else if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else if (t === "system") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.documentElement.classList.add(isDark ? "dark" : "light");
      }
    };

    applyTheme(theme);

    let mql: MediaQueryList | null = null;
    const systemListener = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(e.matches ? "dark" : "light");
      }
    };

    if (theme === "system") {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", systemListener);
    }
    return () => {
      if (mql) mql.removeEventListener("change", systemListener);
    };
  }, [theme]);

  return (
    <>
      <div className="fixed top-4 left-4 z-50 dark:bg-neutral-900/80 backdrop-blur rounded shadow px-4 py-2 flex gap-2 items-center border border-neutral-200 dark:border-neutral-800">
        <span className="font-semibold text-sm">Tema:</span>
        <button
          onClick={() => setTheme("light")}
          className={`px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800${
            theme === "light" ? " border border-white" : ""
          }`}
        >
          Claro
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800${
            theme === "dark" ? " border border-white" : ""
          }`}
        >
          Escuro
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800${
            theme === "system" ? " border border-white" : ""
          }`}
        >
          Sistema
        </button>
      </div>

      <main className="flex flex-col items-center justify-center pt-16 pb-4 gap-4">
        <section className="flex flex-col gap-4 w-full max-w-2xl mt-8">
          <Surface className="flex flex-col gap-4">
            <div>
              <ExampleContent title=".surface" fullText={true} />
              <ButtonGroup variant="default" withPopover={true} />
            </div>
            <Surface variant="high">
              <ExampleContent title=".surface high" fullText={true} />
              <ButtonGroup variant="default" withPopover={true} />{" "}
            </Surface>
            <Surface variant="low">
              <ExampleContent title=".surface low" fullText={true} />
              <ButtonGroup variant="default" withPopover={true} />{" "}
            </Surface>
          </Surface>

          <Surface variant="inverted" className="low">
            <ExampleContent title=".surface inverted low" fullText={true} />
            <ButtonGroup variant="default" withPopover={true} />
          </Surface>

          <Surface variant="accent" title=".surface accent">
            <ExampleContent fullText={false} />

            <ButtonGroup variant="accent" hideDefault={true} />
          </Surface>

          <Surface variant="danger" title=".surface danger">
            <ExampleContent fullText={false} />

            <ButtonGroup variant="danger" hideDefault={true} />
          </Surface>

          <Surface variant="success" title=".surface success">
            <ExampleContent fullText={false} />

            <ButtonGroup variant="success" hideDefault={true} />
          </Surface>

          <Surface variant="info" title=".surface info">
            <ExampleContent fullText={false} />
            <ButtonGroup variant="info" hideDefault={true} />
          </Surface>

          <Surface variant="warning" title=".surface warning">
            <ExampleContent fullText={false} />
            <ButtonGroup variant="warning" hideDefault={true} />
          </Surface>
        </section>
      </main>
    </>
  );
}
