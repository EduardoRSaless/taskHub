import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        
        {/* Lado Direito (Imagem/Logo) */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-brand-950/50 lg:grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-brand-950 opacity-90"></div>
          
          <div className="relative flex flex-col items-center justify-center z-10 px-10 text-center">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            
            <div className="flex flex-col items-center max-w-md animate-fade-in-up">
              <Link to="/" className="block mb-8 transition-transform hover:scale-105">
                <img
                  width={280}
                  height={60}
                  src="/images/logo/auth-logo.png"
                  alt="Logo"
                  className="drop-shadow-2xl"
                />
              </Link>
              
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                Gerencie seus projetos com eficiência
              </h2>
              
              <p className="text-lg text-gray-300/90 leading-relaxed">
                A plataforma completa para organizar times, tarefas e alcançar seus objetivos.
              </p>
            </div>
          </div>
        </div>

        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
