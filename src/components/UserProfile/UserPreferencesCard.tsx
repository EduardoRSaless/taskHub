import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function UserPreferencesCard() {
  const { theme, toggleTheme } = useTheme();
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const [timezone, setTimezone] = useState("Brasília (GMT-3)");
  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
  });

  useEffect(() => {
    // Carregar preferência salva do calendário
    const savedView = localStorage.getItem("calendarDefaultView");
    if (savedView) {
      setCalendarView(savedView);
    }
  }, []);

  const handleCalendarViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = e.target.value;
    setCalendarView(newView);
    localStorage.setItem("calendarDefaultView", newView);
    // Disparar evento customizado para notificar outras abas/componentes se necessário
    window.dispatchEvent(new Event("storage"));
  };

  const handleThemeChange = (selectedTheme: "light" | "dark") => {
    if (theme !== selectedTheme) {
      toggleTheme();
    }
  };

  const handleNotificationChange = (type: "email" | "system") => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Preferências do Sistema
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Personalize sua experiência no calendário e notificações.
          </p>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0918 2.78206C14.2125 1.90284 12.7873 1.90284 11.908 2.78206L4.57524 10.1149L3.95721 13.2051L7.04743 12.5871L14.3802 5.25427C15.2594 4.37505 15.2594 2.94988 14.3802 2.07066L15.0918 2.78206ZM12.9698 1.72026C14.433 0.257002 16.8056 0.257002 18.2689 1.72026C19.7321 3.18351 19.7321 5.55613 18.2689 7.01939L10.5039 14.7844C10.2913 14.9969 10.0186 15.1331 9.72503 15.175L4.57338 16.0336C3.96236 16.1354 3.41279 15.5859 3.51463 14.9748L4.37323 9.82319C4.41513 9.5296 4.5513 9.25691 4.76389 9.04432L12.9698 1.72026ZM11.3773 3.31272L4.04454 10.6456L3.58102 12.9632L5.89863 12.4997L13.2314 5.16687L11.3773 3.31272Z"
              fill=""
            />
          </svg>
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2 lg:gap-12">
        {/* Coluna 1: Calendário e Fuso */}
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Visão Padrão do Calendário
            </label>
            <select
              value={calendarView}
              onChange={handleCalendarViewChange}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
            >
              <option value="timeGridDay">Dia</option>
              <option value="timeGridWeek">Semana</option>
              <option value="dayGridMonth">Mês</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Fuso Horário
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
            >
              <option value="Brasília (GMT-3)">Brasília (GMT-3)</option>
              <option value="Lisboa (GMT+0)">Lisboa (GMT+0)</option>
              <option value="New York (GMT-5)">New York (GMT-5)</option>
            </select>
          </div>
        </div>

        {/* Coluna 2: Notificações e Tema */}
        <div className="space-y-6">
          <div>
            <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-400">
              Notificações
            </h5>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Notificações por Email
                </span>
                <div className="relative inline-block h-6 w-11">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange("email")}
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-gray-700"></div>
                </div>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Notificações no Sistema
                </span>
                <div className="relative inline-block h-6 w-11">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={notifications.system}
                    onChange={() => handleNotificationChange("system")}
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-gray-700"></div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-400">
              Tema da Interface
            </h5>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  theme === "light"
                    ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                }`}
              >
                Claro
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                }`}
              >
                Escuro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
