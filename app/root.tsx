import React from "react";
import { ThemeController } from "./components/ThemeController";
import { PaletteCustomizer, VARS } from "./components/PaletteCustomizer";
import { Outlet, Scripts, Links, Meta, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body>
        <div className="root">
          <ThemeController />
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppRoot() {
  const [brand, setBrand] = React.useState<string | null>(null);

  React.useEffect(() => {
    function syncBrand() {
      setBrand(localStorage.getItem("brand"));
    }
    syncBrand();
    window.addEventListener("storage", syncBrand);
    window.addEventListener("brandChange", syncBrand);
    return () => {
      window.removeEventListener("storage", syncBrand);
      window.removeEventListener("brandChange", syncBrand);
    };
  }, []);

  // Limpa variáveis customizadas ao sair da brand custom
  React.useEffect(() => {
    const root = document.documentElement;
    if (brand !== "custom") {
      Object.values(VARS).forEach((varsArr) => {
        varsArr.forEach((cssVar) => {
          root.style.removeProperty(cssVar);
        });
      });
    }
  }, [brand]);

  return (
    <>
      <ThemeController />
      {brand === "custom" && <PaletteCustomizer />}
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
