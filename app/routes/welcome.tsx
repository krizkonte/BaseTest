import React from "react";
import BaseButton from "../components/base/BaseButton";
import BasePopover from "../components/base/BasePopover";

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
        {/* Exemplos de superfícies */}
        <section className="flex flex-col gap-4 w-full max-w-lg mt-8">
          <div className="surface-default p-4 rounded shadow">
            <strong>.surface-default</strong>
            <p>Superfície padrão, adaptável ao tema.</p>
            <p className="text-surface-default">Texto padrão</p>
            <p className="text-surface-secondary">Texto secundário</p>
            <p className="text-surface-tertiary">Texto terciário</p>
            <p className="text-surface-disabled">Texto desabilitado</p>
            <p className="text-success">Operação realizada com sucesso!</p>
            <p className="text-error">Ocorreu um erro.</p>
            <a href="#" className="text-link">
              Clique aqui para ver o link
            </a>
            <div className="flex flex-wrap gap-2 mt-4">
              <BaseButton>Default</BaseButton>
              <BaseButton variant="outline">Outline</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="danger">Danger</BaseButton>
              <BaseButton variant="ghostDanger">Ghost Danger</BaseButton>
            </div>
          </div>
          <div className="surface-default inverted p-4 rounded shadow">
            <strong>.surface-inverted</strong>
            <p>Superfície invertida, para contraste.</p>
            <p className="text-surface-default">Texto padrão</p>
            <p className="text-surface-secondary">Texto secundário</p>
            <p className="text-surface-tertiary">Texto terciário</p>
            <p className="text-surface-disabled">Texto desabilitado</p>
            <div className="flex gap-2 mt-4">
              <BaseButton>Default</BaseButton>
              <BaseButton variant="outline">Outline</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="danger">Danger</BaseButton>
              <BaseButton variant="ghostDanger">Ghost Danger</BaseButton>
            </div>
          </div>
          <div className="surface-accent p-4 rounded shadow">
            <strong>.surface-accent</strong>
            <p>Superfície de destaque (accent/brand).</p>
            <p className="text-surface-default">Texto padrão</p>
            <p className="text-surface-secondary">Texto secundário</p>
            <p className="text-surface-tertiary">Texto terciário</p>
            <p className="text-surface-disabled">Texto desabilitado</p>
            <div className="flex gap-2 mt-4">
              <BaseButton variant="outline">Outline</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
            </div>
          </div>
          <div className="surface-danger p-4 rounded shadow">
            <strong>.surface-danger</strong>
            <p>Superfície de erro/alerta.</p>
            <p className="text-surface-default">Texto padrão</p>
            <p className="text-surface-secondary">Texto secundário</p>
            <p className="text-surface-tertiary">Texto terciário</p>
            <p className="text-surface-disabled">Texto desabilitado</p>
            <div className="flex gap-2 mt-4">
              <BaseButton variant="outline">Outline</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
            </div>
          </div>
        </section>
        {/* Exemplos de Tipografia */}
        <section className="flex flex-col gap-2 w-full max-w-md mt-8 p-4 rounded surface-default">
          <strong className="mb-2">Tipografia</strong>
          <div className="typo">Heading - Título </div>
          <div className="typo heading-1">Heading 1 - Título Principal</div>
          <div className="typo heading-2">Heading 2 - Subtítulo</div>
          <div className="typo heading-3">Heading 3 - Seção</div>
          <div className="typo heading-4">Heading 4 - Sub-seção</div>
          <div className="typo heading-5">Heading 5 - Legenda</div>
          <div className="typo body-xl">
            Body XL - Texto grande para destaque
          </div>
          <div className="typo body-lg">Body LG - Texto de corpo grande</div>
          <div className="typo body-lg font-black">
            Body LG Bold - Texto com peso black
          </div>
          <div className="typo body-md">
            Body MD - Texto de corpo médio (padrão)
          </div>
          <div className="typo body-sm">
            Body SM - Texto de corpo pequeno ou secundário
          </div>
        </section>
      </main>
    </>
  );
}
