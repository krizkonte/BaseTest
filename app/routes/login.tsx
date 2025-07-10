import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/base/Card";
import { EmailField } from "../components/base/fields/EmailField";
import { PasswordField } from "../components/base/fields/PasswordField";
import Checkbox from "../components/base/Checkbox";
import BaseButton from "../components/base/Button";
import { Typography } from "../components/base/Typography";

const CardLogin = () => (
  <Card className="max-w-md mx-auto surface">
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
);

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <CardLogin />
    </div>
  );
}
