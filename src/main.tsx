import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { DataProvider } from "./context/DataContext.tsx";
import { LanguageProvider } from "./context/LanguageContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx"; // Importar AuthProvider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider> {/* Adicionado */}
          <DataProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </DataProvider>
        </AuthProvider> {/* Adicionado */}
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
);
