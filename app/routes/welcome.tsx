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
import Popover from "../components/base/Popover";
import FloatingDiv from "../components/FloatingDiv";
import ListItem from "../components/base/list-item/ListItem";
import { Icon } from "../components/base/Icon";

export function Welcome() {
  return (
    <>
      <main className="flex flex-wrap gap-4 justify-center pt-6">
        <div className="flex flex-col *:flex *:flex-col gap-4 pt-6 pr-2">
          <div className="gap-1">
            <Typography variant="heading-1">typo heading-1</Typography>
            <Typography variant="heading-2">typo heading-2</Typography>
            <Typography variant="title-1">typo title-1</Typography>
            <Typography variant="title-2">typo title-2</Typography>
            <Typography variant="body-1">typo body-1</Typography>
            <Typography variant="body-2">typo body-2</Typography>
            <Typography variant="caption-1">typo caption-1</Typography>
            <Typography variant="caption-2">typo caption-2</Typography>
          </div>
          <div className="gap-2">
            <Typography variant="body-1" weight="black">
              typo font-black
            </Typography>
            <Typography variant="body-1" weight="extrabold">
              typo font-extrabold
            </Typography>
            <Typography variant="body-1" weight="bold">
              typo font-bold
            </Typography>
            <Typography variant="body-1" weight="semibold">
              typo font-semibold
            </Typography>
            <Typography variant="body-1" weight="medium">
              typo font-medium
            </Typography>
            <Typography variant="body-1" weight="regular">
              typo font-regular
            </Typography>
            <Typography variant="body-1" weight="light">
              typo font-light
            </Typography>
          </div>
        </div>

        <div className="flex flex-row h-fit">
          <section className="surface flex flex-col gap-2 p-6 shadow h-fit rounded-l-[var(--box-rounded)]">
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
            <div className="flex flex-wrap gap-1">
              <Button>Button</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Popover></Popover>
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
              {/* Novo Card com ListItem */}
              <Card className="max-w-md mx-auto mt-4">
                <CardHeader>
                  <CardTitle size="title-2">Exemplo de Item de Lista</CardTitle>
                </CardHeader>
                <CardContent>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 1
                  </ListItem>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 2
                  </ListItem>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 3
                  </ListItem>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="flex flex-col">
            <section className="surface elevation-low flex flex-col gap-2 max-w-md p-6 shadow h-full rounded-tr-[var(--box-rounded)]">
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
              <div className="flex flex-wrap gap-1">
                <Button>Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
              {/* Novo Card com ListItem */}
              <Card className="max-w-md mx-auto mt-4 elevation-low">
                <CardHeader>
                  <CardTitle size="title-2">Exemplo de Item de Lista</CardTitle>
                </CardHeader>
                <CardContent>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 1
                  </ListItem>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 2
                  </ListItem>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 3
                  </ListItem>
                </CardContent>
              </Card>
            </section>

            <section className="surface elevation-high flex flex-col gap-2 max-w-md p-6 shadow h-full rounded-br-[var(--box-rounded)]">
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
              <div className="flex flex-wrap gap-1">
                <Button>Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
              {/* Novo Card com ListItem */}
              <Card className="max-w-md mx-auto mt-4 elevation-high">
                <CardHeader>
                  <CardTitle size="title-2">Exemplo de Item de Lista</CardTitle>
                </CardHeader>
                <CardContent>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 1
                  </ListItem>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 2
                  </ListItem>
                  <ListItem
                    buttonIcon={<Icon icon="Plus" size="sm" />}
                    onButtonClick={() => alert("Ação clicada!")}
                  >
                    Item de lista simples 3
                  </ListItem>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        <div className="w-xl">
          <div className="flex flex-row">
            <section className="surface-accent intent-brand flex flex-col gap-2 max-w-md p-6 shadow rounded-tl-[var(--box-rounded)]">
              <h2 className="text-xl font-bold mb-2">
                surface-accent intent-brand
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
            <section className="surface-subtle intent-brand flex flex-col gap-2 max-w-md p-6 shadow rounded-tr-[var(--box-rounded)]">
              <h2 className="text-xl font-bold mb-2">
                surface-subtle intent-brand
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
          </div>

          {/* Blocos de teste para surface-accent intent-danger */}
          <div className="flex flex-row">
            <section className="surface-accent intent-danger flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">
                surface-accent intent-danger
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
            <section className="surface-subtle intent-danger flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">
                surface-subtle intent-danger
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
          </div>

          {/* Blocos de teste para surface-accent intent-success */}
          <div className="flex flex-row">
            <section className="surface-accent intent-success flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">
                surface-accent intent-success
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
            <section className="surface-subtle intent-success flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">
                surface-subtle intent-success
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
          </div>
          {/* Blocos de teste para surface-accent intent-warning */}
          <div className="flex flex-row">
            <section className="surface-accent intent-warning flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">
                surface-accent intent-warning
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
            <section className="surface-subtle intent-warning flex flex-col gap-2 max-w-md p-6 shadow">
              <h2 className="text-xl font-bold mb-2">
                surface-subtle intent-warning
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
          </div>

          {/* Blocos de teste para surface-accent intent-info */}
          <div className="flex flex-row">
            <section className="surface-accent intent-info flex flex-col gap-2 max-w-md p-6 shadow rounded-bl-[var(--box-rounded)]">
              <h2 className="text-xl font-bold mb-2">
                surface-accent intent-info
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
            <section className="surface-subtle intent-info flex flex-col gap-2 max-w-md p-6 shadow rounded-br-[var(--box-rounded)]">
              <h2 className="text-xl font-bold mb-2">
                surface-subtle intent-info
              </h2>
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
              <div className="flex flex-wrap gap-1">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Popover></Popover>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Div Flutuante */}
      <FloatingDiv>
        <div className="space-y-4">
          <Typography variant="heading-2">Div Flutuante</Typography>
          <Typography variant="body-1">
            Esta é uma div flutuante que pode ser arrastada e redimensionada.
          </Typography>
          <div className="space-y-2">
            <Typography variant="title-2">Funcionalidades:</Typography>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Arraste pela barra de título</li>
              <li>Redimensione pelo canto inferior direito</li>
              <li>Clique no botão vermelho para fechar</li>
              <li>Flutua acima de toda a interface</li>
            </ul>
          </div>
          <div className="pt-2">
            <Button variant="outline" size="sm">
              Botão de Exemplo
            </Button>
          </div>
        </div>
      </FloatingDiv>
    </>
  );
}
