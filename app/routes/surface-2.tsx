import Button from "../components/base/Button";

export function Welcome() {
  return (
    <>
      <main className="flex flex-col items-center justify-top pt-16 pb-4 gap-4 min-h-screen">
        <div className="flex flex-row">
          <section className="surface flex flex-col gap-2 max-w-md p-6 shadow">
            <h2 className="text-xl font-bold mb-2">surface</h2>
            <div>Texto padrão</div>
            <div className="text-secondary">
              Texto secundário (.text-secondary)
            </div>
            <div className="text-tertiary">
              Texto terciário (.text-tertiary)
            </div>
            <div className="text-disabled">
              Texto desabilitado (.text-disabled)
            </div>
            <div className="text-link">Texto de link (.text-link)</div>
            <div className="text-success">Texto de sucesso (.text-success)</div>
            <div className="text-warning">Texto de aviso (.text-warning)</div>
            <div className="text-danger">Texto de danger (.text-danger)</div>
            <div className="text-info">Texto informativo (.text-info)</div>
            <div className="flex flex-row gap-1">
              <Button>Button</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </section>

          <div className="flex flex-col">
            <section className="surface elevation-low flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface elevation-low</h2>
              <div>Texto padrão</div>
              <div className="text-secondary">
                Texto secundário (.text-secondary)
              </div>
              <div className="text-tertiary">
                Texto terciário (.text-tertiary)
              </div>
              <div className="text-disabled">
                Texto desabilitado (.text-disabled)
              </div>
              <div className="flex flex-row gap-1">
                <Button>Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </section>

            <section className="surface elevation-high flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface elevation-high</h2>
              <div>Texto padrão</div>
              <div className="text-secondary">
                Texto secundário (.text-secondary)
              </div>
              <div className="text-tertiary">
                Texto terciário (.text-tertiary)
              </div>
              <div className="text-disabled">
                Texto desabilitado (.text-disabled)
              </div>
              <div className="flex flex-row gap-1">
                <Button>Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </section>
          </div>
        </div>

        <div className="flex flex-row">
          <section className="surface-brand flex flex-col gap-2 max-w-md p-6 shadow">
            <h2 className="text-xl font-bold mb-2">surface-brand</h2>
            <div>Texto padrão</div>
            <div className="text-secondary">
              Texto secundário (.text-secondary)
            </div>
            <div className="text-tertiary">
              Texto terciário (.text-tertiary)
            </div>
            <div className="text-disabled">
              Texto desabilitado (.text-disabled)
            </div>
            <div className="flex flex-row gap-1">
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </section>
          <section className="surface-brand subtle flex flex-col gap-2 max-w-md p-6 shadow">
            <h2 className="text-xl font-bold mb-2">surface-brand subtle</h2>
            <div>Texto padrão</div>
            <div className="text-secondary">
              Texto secundário (.text-secondary)
            </div>
            <div className="text-tertiary">
              Texto terciário (.text-tertiary)
            </div>
            <div className="text-disabled">
              Texto desabilitado (.text-disabled)
            </div>
            <div className="flex flex-row gap-1">
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </section>
        </div>

        {/* Blocos de teste para surface-danger */}
        <div className="flex flex-row">
          <section className="surface-danger flex flex-col gap-2 max-w-md p-6 shadow">
            <h2 className="text-xl font-bold mb-2">surface-danger</h2>
            <div>Texto padrão</div>
            <div className="text-secondary">
              Texto secundário (.text-secondary)
            </div>
            <div className="text-tertiary">
              Texto terciário (.text-tertiary)
            </div>
            <div className="text-disabled">
              Texto desabilitado (.text-disabled)
            </div>
            <div className="flex flex-row gap-1">
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </section>
          <section className="surface-danger subtle flex flex-col gap-2 max-w-md p-6 shadow">
            <h2 className="text-xl font-bold mb-2">surface-danger subtle</h2>
            <div>Texto padrão</div>
            <div className="text-secondary">
              Texto secundário (.text-secondary)
            </div>
            <div className="text-tertiary">
              Texto terciário (.text-tertiary)
            </div>
            <div className="text-disabled">
              Texto desabilitado (.text-disabled)
            </div>
            <div className="flex flex-row gap-1">
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
