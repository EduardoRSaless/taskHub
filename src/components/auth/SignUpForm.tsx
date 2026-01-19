import { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useAuth } from "../../context/AuthContext";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!isChecked) {
      setError("Aceite os termos.");
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      setError("Preencha tudo.");
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`;
      await signup(fullName, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Falha no cadastro com Google");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full h-full justify-center animate-fade-in-up">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 text-center sm:text-left">
          <h1 className="mb-1 text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
            Crie sua conta
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Comece sua jornada gratuitamente.
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleGoogleLogin}
            className="relative flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
              <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
              <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
              <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
            </svg>
            Google
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <span className="relative bg-white px-2 text-xs text-gray-400 dark:bg-gray-900">
              ou
            </span>
          </div>
            
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 text-xs">Nome</Label>
                <Input
                  type="text"
                  placeholder="Nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="py-2 text-sm"
                />
              </div>
              <div>
                <Label className="mb-1 text-xs">Sobrenome</Label>
                <Input
                  type="text"
                  placeholder="Sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1 text-xs">Email</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 text-sm"
              />
            </div>

            <div>
              <Label className="mb-1 text-xs">Senha</Label>
              <div className="relative">
                <Input
                  placeholder="Senha"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2 text-sm pr-10" // Adicionado pr-10
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 p-1" // Adicionado z-10 e p-1
                >
                  {showPassword ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeCloseIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded bg-red-50 p-2 text-xs text-red-500 animate-shake">
                {error}
              </div>
            )}

            <div className="flex items-start gap-2">
              <Checkbox
                className="w-4 h-4 mt-0.5"
                checked={isChecked}
                onChange={setIsChecked}
              />
              <p className="text-xs text-gray-500 leading-tight">
                Concordo com os <span className="font-medium text-gray-700 cursor-pointer hover:underline">Termos</span> e <span className="font-medium text-gray-700 cursor-pointer hover:underline">Privacidade</span>.
              </p>
            </div>

            <button 
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.98] hover:bg-brand-600 disabled:opacity-70"
            >
              {isLoading ? "Criando..." : "Criar Conta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
