import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Email ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Falha no login com Google");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-md mx-auto animate-fade-in-up">
      <div className="flex flex-col justify-center flex-1 pt-10 sm:pt-0">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
            Bem-vindo de volta!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Insira suas credenciais para acessar sua conta.
          </p>
        </div>

        <div className="space-y-5">
          <button 
            onClick={handleGoogleLogin}
            className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
              <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
              <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
              <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
            </svg>
            Entrar com Google
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <span className="relative bg-white px-3 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              ou entre com email
            </span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <Label>Senha</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha segura"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-brand-500/20 pr-10" // Adicionado pr-10 para não sobrepor o ícone
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10 p-1" // Adicionado z-10 e padding
                  >
                    {showPassword ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeCloseIcon className="size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/10 dark:text-red-400 animate-shake">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Lembrar de mim
                </span>
              </div>
              <Link
                to="/reset-password"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button className="w-full py-3 text-base font-semibold shadow-lg shadow-brand-500/20 transition-transform active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </Button>
          </form>

          {/* Link "Não tem uma conta?" removido daqui pois está no AuthPage */}
        </div>
      </div>
    </div>
  );
}
