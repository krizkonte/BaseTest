import React from "react";
import BaseButton from "../components/base/Button";
import BasePopover from "../components/base/Popover";
import { Typography } from "../components/custom/Typography";
import { Loader } from "../components/custom/Loader";
import { Icon } from "../components/custom/Icon";
import { Plus, Trash2, Settings, Download, Bell, Search } from "lucide-react";
import {
  TextField,
  TextareaField,
  EmailField,
  PasswordField,
} from "../components/base/Field";

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
  subtle = false,
}) => {
  const buttonProps = disabled ? { disabled: true } : {};

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex flex-wrap gap-2">
        {!hideDefault && !subtle && (
          <BaseButton {...buttonProps}>Default</BaseButton>
        )}
        <BaseButton variant="outline" {...buttonProps}>
          Outline
        </BaseButton>
        <BaseButton variant="ghost" {...buttonProps}>
          Ghost
        </BaseButton>
        {withPopover && <BasePopover />}
      </div>
      {variant === "default" && !subtle && (
        <div className="flex flex-wrap gap-2">
          <BaseButton variant="danger" {...buttonProps}>
            Danger
          </BaseButton>
          <BaseButton variant="ghostDanger" {...buttonProps}>
            Ghost Danger
          </BaseButton>
        </div>
      )}
      {variant === "default" && !subtle && (
        <div className="flex flex-wrap gap-2">
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
    {title && (
      <Typography variant="heading-1" as="strong">
        {title}
      </Typography>
    )}
    <Typography variant="body-1">Texto padrão</Typography>
    <Typography variant="body-2" color="secondary">
      Texto secundário
    </Typography>
    {fullText && (
      <Typography variant="body-2" color="tertiary">
        Texto terciário
      </Typography>
    )}
    <Typography variant="body-2" color="disabled" weight="semibold">
      Texto desabilitado
    </Typography>
    {fullText && (
      <>
        <Typography variant="caption-1" as="p" status="success">
          Operação realizada com sucesso!
        </Typography>
        <Typography variant="caption-1" as="p" status="error">
          Ocorreu um erro.
        </Typography>
        <Typography variant="caption-1" as="p" status="info">
          Sou uma informação relevante
        </Typography>
        <Typography variant="caption-1" as="p" status="warning">
          Sou um aviso urgente!
        </Typography>
      </>
    )}
    {fullText && (
      <a href="#" className="text-link">
        <Typography variant="body-2">Clique aqui para ver o link</Typography>
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
    | "brand"
    | "subtle"
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
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "surface p-4 rounded shadow";
  const variantClass = variant !== "default" ? ` ${variant}` : "";
  const classes = `${baseClasses}${variantClass} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {title && (
        <Typography variant="heading-1" as="h3">
          {title}
        </Typography>
      )}
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

  // Estado para a marca atual
  const [brand, setBrand] = React.useState<"a" | "b">("a");

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

  // Atualiza o atributo data-brand no <html> ao mudar o estado brand
  React.useEffect(() => {
    document.documentElement.setAttribute("data-brand", brand);
  }, [brand]);

  return (
    <>
      {/* Menu flutuante de tema */}
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

      {/* Menu flutuante de brand */}
      <div className="fixed top-16 left-4 z-50 dark:bg-neutral-900/80 backdrop-blur rounded shadow px-4 py-2 flex gap-2 items-center border border-neutral-200 dark:border-neutral-800">
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
      </div>

      <main className="flex flex-col items-center justify-center pt-16 pb-4 gap-4">
        <section className="flex flex-col gap-4 w-full max-w-2xl mt-8">
          <Surface className="flex flex-col gap-4">
            <div>
              <ExampleContent title=".surface" fullText={true} />
              <ButtonGroup variant="default" withPopover={true} />
              <TextField name="example1" label="Campo de exemplo" />
            </div>
            <Surface variant="high">
              <ExampleContent title=".surface high" fullText={true} />
              <ButtonGroup variant="default" withPopover={true} />{" "}
              <TextField name="example2" label="Campo de exemplo" />
            </Surface>
            <Surface variant="low">
              <ExampleContent title=".surface low" fullText={true} />
              <ButtonGroup variant="default" withPopover={true} />{" "}
              <TextField name="example3" label="Campo de exemplo" />
            </Surface>
          </Surface>

          <Surface variant="inverted" className="low">
            <ExampleContent title=".surface inverted low" fullText={true} />
            <ButtonGroup variant="default" withPopover={true} />
          </Surface>

          {/* Brand - Normal vs Subtle */}
          <div className="flex gap-4">
            <Surface variant="brand" title=".surface brand" className="flex-1">
              <ExampleContent fullText={false} />
              <ButtonGroup variant="brand" hideDefault={true} />
            </Surface>

            <Surface
              variant="subtle"
              className="brand flex-1"
              title=".surface subtle brand"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="default" subtle={true} />
            </Surface>
          </div>

          {/* Danger - Normal vs Subtle */}
          <div className="flex gap-4">
            <Surface
              variant="danger"
              title=".surface danger"
              className="flex-1"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="danger" hideDefault={true} />
            </Surface>

            <Surface
              variant="subtle"
              className="danger flex-1"
              title=".surface subtle danger"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="default" subtle={true} />
            </Surface>
          </div>

          {/* Success - Normal vs Subtle */}
          <div className="flex gap-4">
            <Surface
              variant="success"
              title=".surface success"
              className="flex-1"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="success" hideDefault={true} />
            </Surface>

            <Surface
              variant="subtle"
              className="success flex-1"
              title=".surface subtle success"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="default" subtle={true} />
            </Surface>
          </div>

          {/* Info - Normal vs Subtle */}
          <div className="flex gap-4">
            <Surface variant="info" title=".surface info" className="flex-1">
              <ExampleContent fullText={false} />
              <ButtonGroup variant="info" hideDefault={true} />
            </Surface>

            <Surface
              variant="subtle"
              className="info flex-1"
              title=".surface subtle info"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="default" subtle={true} />
            </Surface>
          </div>

          {/* Warning - Normal vs Subtle */}
          <div className="flex gap-4">
            <Surface
              variant="warning"
              title=".surface warning"
              className="flex-1"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="warning" hideDefault={true} />
            </Surface>

            <Surface
              variant="subtle"
              className="warning flex-1"
              title=".surface subtle warning"
            >
              <ExampleContent fullText={false} />
              <ButtonGroup variant="default" subtle={true} />
            </Surface>
          </div>
          {/* Exemplo visual de tipografia usando CustomTypo */}
          <div className="p-6 mb-4 flex flex-col gap-1 surface rounded-md">
            <Typography variant="heading-1">typo heading-1</Typography>
            <Typography variant="heading-2">typo heading-2</Typography>
            <Typography variant="title-1">typo title-1</Typography>
            <Typography variant="title-2">typo title-2</Typography>
            <Typography variant="body-1">typo body-1</Typography>
            <Typography variant="body-2">typo body-2</Typography>
            <Typography variant="caption-1">typo caption-1</Typography>
            <Typography variant="caption-2">typo caption-2</Typography>
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

          {/* Exemplos do Button Aprimorado */}
          <Surface title="Button Aprimorado - Estados Básicos">
            <div className="space-y-4 ">
              <div className="space-y-2 ">
                <Typography variant="title-2">Estados Básicos</Typography>
                <div className="flex gap-2 flex-wrap">
                  <BaseButton>Padrão</BaseButton>
                  <BaseButton variant="outline">Outline</BaseButton>
                  <BaseButton variant="ghost">Ghost</BaseButton>
                  <BaseButton variant="danger">Danger</BaseButton>
                  <BaseButton variant="ghostDanger">Ghost Danger</BaseButton>
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">
                  Estados Booleanos (CVA)
                </Typography>
                <div className="flex gap-2 flex-wrap">
                  <BaseButton disabled>Desabilitado</BaseButton>
                  <BaseButton loading>Carregando</BaseButton>
                  <BaseButton fullWidth>Largura Completa</BaseButton>
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">Combinações</Typography>
                <div className="flex gap-2 flex-wrap">
                  <BaseButton variant="outline" size="sm" disabled>
                    Pequeno Desabilitado
                  </BaseButton>
                  <BaseButton variant="danger" size="lg" loading>
                    Grande Carregando
                  </BaseButton>
                  <BaseButton variant="ghost" fullWidth>
                    Ghost Largura Completa
                  </BaseButton>
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">
                  Elementos Customizados
                </Typography>
                <div className="flex gap-2 flex-wrap">
                  <BaseButton as="a" href="#link">
                    Como Link
                  </BaseButton>
                  <BaseButton as="div" onClick={() => alert("Clicou!")}>
                    Como Div (com onClick)
                  </BaseButton>
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">
                  Loading States (Otimizados)
                </Typography>
                <div className="flex gap-2 flex-wrap">
                  <BaseButton loading variant="default">
                    Loading Padrão
                  </BaseButton>
                  <BaseButton loading variant="outline">
                    Loading Outline
                  </BaseButton>
                  <BaseButton loading variant="danger">
                    Loading Danger
                  </BaseButton>
                  <BaseButton loading variant="ghost">
                    Loading Ghost
                  </BaseButton>
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">Ícones em Botões</Typography>
                <div className="flex gap-2 flex-wrap">
                  <BaseButton icon={Plus}>Adicionar Item</BaseButton>
                  <BaseButton icon={Download} variant="outline">
                    Download
                  </BaseButton>
                  <BaseButton icon={Trash2} variant="danger">
                    Excluir
                  </BaseButton>
                  <BaseButton icon={Settings} variant="ghost">
                    Configurações
                  </BaseButton>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <BaseButton icon={Plus} size="sm">
                    Pequeno
                  </BaseButton>
                  <BaseButton icon={Download} size="lg">
                    Grande
                  </BaseButton>
                  <BaseButton
                    icon={Settings}
                    iconOnly
                    aria-label="Configurações"
                  />
                  <BaseButton
                    icon={Bell}
                    iconOnly
                    variant="outline"
                    aria-label="Notificações"
                  />
                </div>
                <Typography variant="caption-1" color="secondary">
                  Ícones Lucide React integrados com tamanhos automáticos
                </Typography>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">Icon Component</Typography>
                <div className="flex gap-4 items-center">
                  <Icon icon={Search} size="sm" />
                  <Icon icon={Settings} size="default" />
                  <Icon icon={Download} size="lg" />
                  <Icon icon={Bell} size="xl" />
                  <Icon icon={Plus} size="default" />
                  <Icon icon={Trash2} size="default" />
                </div>
                <Typography variant="caption-1" color="secondary">
                  Componente Icon reutilizável com diferentes tamanhos e
                  espaçamentos
                </Typography>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">Loader Component</Typography>
                <div className="flex gap-4 items-center">
                  <Loader size="sm" />
                  <Loader size="default" />
                  <Loader size="lg" />
                  <Loader size="xl" />
                  <Loader size="default" spacing="none" />
                  <Loader size="default" spacing="right" />
                </div>
                <Typography variant="caption-1" color="secondary">
                  Componente Loader reutilizável com diferentes tamanhos e
                  espaçamentos
                </Typography>
              </div>
            </div>
          </Surface>

          {/* Exemplos dos Campos */}
          <Surface title="Campos de Formulário - Fase 1">
            <div className="space-y-6">
              <div className="space-y-2">
                <Typography variant="title-2">TextField</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="username"
                    label="Nome de usuário"
                    placeholder="Digite seu nome"
                    required
                  />
                  <TextField
                    name="description"
                    label="Descrição"
                    placeholder="Digite uma descrição"
                    description="Campo opcional para descrição adicional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">TextareaField</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextareaField
                    name="bio"
                    label="Biografia"
                    placeholder="Conte um pouco sobre você..."
                    rows={4}
                  />
                  <TextareaField
                    name="notes"
                    label="Observações"
                    placeholder="Digite suas observações"
                    description="Campo para observações adicionais"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">EmailField</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EmailField
                    name="email"
                    label="Email"
                    placeholder="seu@email.com"
                    required
                    validateOnBlur
                  />
                  <EmailField
                    name="secondaryEmail"
                    label="Email secundário"
                    placeholder="email@exemplo.com"
                    description="Email opcional para notificações"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">PasswordField</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordField
                    name="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    required
                    showToggle
                  />
                  <PasswordField
                    name="confirmPassword"
                    label="Confirmar senha"
                    placeholder="Confirme sua senha"
                    required
                    showToggle
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="title-2">Estados dos Campos</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="disabled"
                    label="Campo desabilitado"
                    placeholder="Não é possível editar"
                    disabled
                  />
                  <TextField
                    name="error"
                    label="Campo com erro"
                    placeholder="Digite algo"
                    error="Este campo é obrigatório"
                  />
                </div>
              </div>
            </div>
          </Surface>
        </section>
      </main>
    </>
  );
}
