// Configuração centralizada para rotas base
export const config = {
  // Para desenvolvimento local
  development: {
    base: "/",
    basename: "/",
  },
  // Para produção (GitHub Pages)
  production: {
    base: "/BaseTest/",
    basename: "/BaseTest",
  },
  // Para outros ambientes (você pode adicionar mais)
  staging: {
    base: "/staging/",
    basename: "/staging",
  },
};

// Detecta o ambiente atual
const getEnvironment = () => {
  if (process.env.NODE_ENV === "development") return "development";
  if (process.env.VITE_ENV === "staging") return "staging";
  return "production";
};

export const currentConfig = config[getEnvironment()];

// Funções auxiliares
export const getBase = () => currentConfig.base;
export const getBasename = () => currentConfig.basename;
