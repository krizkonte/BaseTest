import React from "react";

export function ThemeController() {
  // Estado inicial seguro para SSR
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(
    "system"
  );
  const [brand, setBrand] = React.useState<"a" | "b" | "custom">("a");

  // Detecta tema/brand inicial no client (opcional: pode ler do localStorage)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      setTheme(savedTheme);
    }
    const savedBrand = localStorage.getItem("brand");
    if (savedBrand === "a" || savedBrand === "b" || savedBrand === "custom") {
      setBrand(savedBrand);
    }
  }, []);

  // Aplica o tema no DOM e salva no localStorage
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove("light", "dark");
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDark ? "dark" : "light");
    }
    // Salva escolha do usuário
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
    // Listener para system
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

  // Aplica a brand no DOM e salva no localStorage
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-brand", brand);
    if (typeof window !== "undefined") {
      localStorage.setItem("brand", brand);
      window.dispatchEvent(new Event("brandChange"));
    }
  }, [brand]);

  return (
    <>
      <div
        className="fixed top-4 left-4 z-50 backdrop-blur rounded shadow px-4 py-2 flex gap-2 items-center border border-neutral-200 dark:border-neutral-800"
        style={{ background: "#222", color: "#fff" }}
      >
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
      <div
        className="fixed top-16 left-4 z-50 backdrop-blur rounded shadow px-4 py-2 flex gap-2 items-center border border-neutral-200 dark:border-neutral-800"
        style={{ background: "#222", color: "#fff" }}
      >
        <span className="font-semibold text-sm">Marca:</span>
        <button
          onClick={() => setBrand("a")}
          className={`px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800${
            brand === "a" ? " border border-white" : ""
          }`}
        >
          Brand A
        </button>
        <button
          onClick={() => setBrand("b")}
          className={`px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800${
            brand === "b" ? " border border-white" : ""
          }`}
        >
          Brand B
        </button>
        <button
          onClick={() => setBrand("custom")}
          className={`px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800${
            brand === "custom" ? " border border-white" : ""
          }`}
        >
          Custom
        </button>
      </div>
    </>
  );
}
