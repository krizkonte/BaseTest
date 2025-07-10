import Button from "../components/base/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/base/Card";
import { EmailField, PasswordField } from "../components/base/Field";
import Checkbox from "../components/base/Checkbox";
import BaseButton from "../components/base/Button";
import { Typography } from "../components/base/Typography";

export function Welcome() {
  return (
    <>
      <main className="flex flex-row gap-4 justify-center pt-6">
        <div className="flex flex-row">
          <section className="surface flex flex-col gap-2 p-6 shadow h-fit">
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
            <div className="text-error">Texto de erro (.text-error)</div>
            <div className="text-info">Texto informativo (.text-info)</div>
            <div className="flex flex-row gap-1">
              <Button>Button</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="pt-4">
              <Card className="max-w-md mx-auto surface elevation-high border border-surface">
                <CardHeader>
                  <CardTitle size="heading-2">Entrar</CardTitle>
                  <CardDescription>
                    Digite suas credenciais para acessar sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EmailField
                    name="email"
                    label="Email"
                    placeholder="seu@email.com"
                    required
                  />
                  <PasswordField
                    name="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    required
                    showToggle
                  />
                  <div className="flex items-center justify-between">
                    <Checkbox label="Lembrar de mim" defaultChecked={false} />
                    <a href="#" className="text-link typo caption-1">
                      Esqueceu a senha?
                    </a>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-3">
                  <BaseButton className="w-full">Entrar</BaseButton>
                  <div className="text-center">
                    <Typography variant="caption-1" color="secondary">
                      Não tem uma conta?{" "}
                      <a href="#" className="text-link">
                        Cadastre-se
                      </a>
                    </Typography>
                  </div>
                </CardFooter>
              </Card>
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

        <div>
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

          {/* Blocos de teste para surface-success */}
          <div className="flex flex-row">
            <section className="surface-success flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface-success</h2>
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
            <section className="surface-success subtle flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface-success subtle</h2>
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
          {/* Blocos de teste para surface-warning */}
          <div className="flex flex-row">
            <section className="surface-warning flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface-warning</h2>
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
            <section className="surface-warning subtle flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface-warning subtle</h2>
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

          {/* Blocos de teste para surface-info */}
          <div className="flex flex-row">
            <section className="surface-info flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface-info</h2>
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
            <section className="surface-info subtle flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">surface-info subtle</h2>
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
        </div>
      </main>
    </>
  );
}
