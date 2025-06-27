// border-utilities.js
module.exports = function ({ matchUtilities }) {
  // Defina suas cores de borda customizadas
  const customBorderColors = {
    weak: "oklch(var(--neutral-100))",
    medium: "oklch(var(--neutral-200))",
    strong: "oklch(var(--neutral-300))",
    accent: "oklch(var(--brand-600))",
    danger: "oklch(var(--danger-500))",
    success: "oklch(var(--success-500))",
    warning: "oklch(var(--warning-500))",
    info: "oklch(var(--info-500))",
  };

  // Gera todas as variações automaticamente
  matchUtilities(
    {
      // Border geral: .border-surface, .border-accent, etc.
      border: (value) => ({ "border-color": value }),

      // Direções individuais
      "border-t": (value) => ({ "border-top-color": value }),
      "border-r": (value) => ({ "border-right-color": value }),
      "border-b": (value) => ({ "border-bottom-color": value }),
      "border-l": (value) => ({ "border-left-color": value }),

      // Eixos
      "border-x": (value) => ({
        "border-left-color": value,
        "border-right-color": value,
      }),
      "border-y": (value) => ({
        "border-top-color": value,
        "border-bottom-color": value,
      }),
    },
    {
      values: customBorderColors,
      type: "color", // Opcional: ajuda com IntelliSense
    }
  );
};
