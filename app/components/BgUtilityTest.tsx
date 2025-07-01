import React from "react";
import { BaseButton } from "./base/BaseButton";

// Componente reutilizável para exibir um nome de classe de forma estilizada
function ClassNameLabel({ name }: { name: string }) {
  return (
    <span className="absolute top-2 right-2 surface-inverted font-mono text-xs px-1.5 py-0.5 rounded-full border-1 border-weak">
      {name}
    </span>
  );
}

// Componente que demonstra a hierarquia de tipografia e cores de texto
function TextSamples() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="heading-1">Heading 1</p>
        <p className="body-lg text-secondary">
          This is a large body text, perfect for introductions and lead paragraphs.
        </p>
      </div>
      <div>
        <p className="heading-3">Heading 3</p>
        <p className="body-md text-tertiary">
          This is a medium body text, suitable for longer content. It provides a comfortable reading experience.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-success">.text-success</span>
        <span className="text-warning">.text-warning</span>
        <span className="text-error">.text-error</span>
        <span className="text-info">.text-info</span>
        <span className="text-disabled">.text-disabled</span>
      </div>
    </div>
  );
}

// Componente de Card para demonstrar uma superfície específica
function SurfaceCard({ title, surfaceClass }: { title: string; surfaceClass: string }) {
  return (
    <div className={`relative p-6 rounded-lg border-1 border-medium ${surfaceClass}`}>
      <ClassNameLabel name={surfaceClass} />
      <h2 className="heading-2 mb-4">{title}</h2>
      <TextSamples />
      <div className="mt-6 flex gap-4">
        <BaseButton variant="default">Default</BaseButton>
        <BaseButton variant="outline">Outline</BaseButton>
        <BaseButton variant="ghost">Ghost</BaseButton>
        <BaseButton variant="destructive">Destructive</BaseButton>
        <BaseButton variant="destructiveGhost">Destructive Ghost</BaseButton>
      </div>
    </div>
  );
}

// Componente principal que organiza e exibe todos os testes de superfície
export default function BgUtilityTest() {
  return (
    <div className="p-4 sm:p-8 surface-default">
      <header className="mb-8">
        <h1 className="page-title">Surface & Typography System</h1>
        <p className="page-subtitle">
          Demonstrating the contextual relationship between background surfaces and typography.
        </p>
      </header>
      <main className="flex flex-col gap-8">
        <SurfaceCard title="Default Surface" surfaceClass="surface-default" />
        <SurfaceCard title="Inverted Surface" surfaceClass="surface-inverted" />
        <SurfaceCard title="Accent Surface" surfaceClass="surface-accent" />
        <SurfaceCard title="Danger Surface" surfaceClass="surface-danger" />
      </main>
    </div>
  );
}