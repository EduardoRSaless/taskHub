import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import SignInForm from "../../components/auth/SignInForm";
import SignUpForm from "../../components/auth/SignUpForm";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Sincronizar estado com a URL
  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  const toggleMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    // Atualizar URL sem recarregar a página inteira
    navigate(newMode ? "/signup" : "/signin", { replace: true });
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[1000px] min-h-[600px] overflow-hidden">
        
        {/* Container do Formulário de Cadastro (Começa oculto na esquerda, move para direita) */}
        <div 
          className={`absolute top-0 left-0 h-full w-full lg:w-1/2 flex flex-col justify-center p-8 transition-all duration-700 ease-in-out ${
            isSignUp 
              ? "lg:translate-x-full opacity-100 z-20" // Vai para a direita e aparece
              : "opacity-0 z-10" // Fica oculto
          }`}
        >
          <SignUpForm />
          {/* Link Mobile */}
          <div className="mt-4 text-center lg:hidden">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{" "}
              <button onClick={toggleMode} className="text-brand-500 font-bold hover:underline">
                Entrar
              </button>
            </p>
          </div>
        </div>

        {/* Container do Formulário de Login (Começa visível na esquerda) */}
        <div 
          className={`absolute top-0 left-0 h-full w-full lg:w-1/2 flex flex-col justify-center p-8 transition-all duration-700 ease-in-out ${
            isSignUp 
              ? "lg:translate-x-full opacity-0 z-10" // Vai para a direita e some (opcional, ou fica por baixo)
              : "translate-x-0 opacity-100 z-20" // Fica na esquerda visível
          }`}
        >
          <SignInForm />
          {/* Link Mobile */}
          <div className="mt-4 text-center lg:hidden">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não tem uma conta?{" "}
              <button onClick={toggleMode} className="text-brand-500 font-bold hover:underline">
                Cadastre-se
              </button>
            </p>
          </div>
        </div>

        {/* Painel Deslizante (Overlay) - Apenas Desktop */}
        <div 
          className={`absolute top-0 left-1/2 w-1/2 h-full hidden lg:flex flex-col justify-center items-center bg-brand-950 text-white transition-transform duration-700 ease-in-out z-30 overflow-hidden ${
            isSignUp ? "-translate-x-full rounded-r-2xl rounded-l-none" : "translate-x-0 rounded-l-2xl rounded-r-none"
          }`}
        >
          {/* Fundo com Gradiente e Formas */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-brand-950 opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
             <GridShape />
          </div>

          {/* Conteúdo do Painel - Login View (Convite para Cadastro) */}
          <div className={`relative z-10 flex flex-col items-center text-center px-10 transition-all duration-700 delay-100 ${isSignUp ? "translate-x-full opacity-0 absolute" : "translate-x-0 opacity-100"}`}>
            <h2 className="text-3xl font-bold mb-4">Olá, Visitante!</h2>
            <p className="mb-8 text-gray-200">
              Insira seus dados pessoais e comece sua jornada conosco.
            </p>
            <button 
              onClick={toggleMode}
              className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-brand-950 transition-colors"
            >
              Cadastre-se
            </button>
          </div>

          {/* Conteúdo do Painel - Signup View (Convite para Login) */}
          <div className={`relative z-10 flex flex-col items-center text-center px-10 transition-all duration-700 delay-100 ${!isSignUp ? "-translate-x-full opacity-0 absolute" : "translate-x-0 opacity-100"}`}>
            <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
            <p className="mb-8 text-gray-200">
              Para se manter conectado conosco, faça login com suas informações pessoais.
            </p>
            <button 
              onClick={toggleMode}
              className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-brand-950 transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>

        {/* Theme Toggler */}
        <div className="absolute bottom-4 right-4 z-50">
          <ThemeTogglerTwo />
        </div>

      </div>
    </div>
  );
}
