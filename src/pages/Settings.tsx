import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { UserIcon, CalenderIcon, AlertIcon, LockIcon } from "../icons";
import { useLanguage } from "../context/LanguageContext";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const { t } = useLanguage();

  return (
    <>
      <PageMeta
        title={`${t("settings.title")} | Dashboard`}
        description="Gerencie as preferências e regras do sistema"
      />
      <PageBreadcrumb pageTitle={t("settings.title")} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Menu Lateral */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "general"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <UserIcon className="h-5 w-5" />
                {t("settings.general")}
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "calendar"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <CalenderIcon className="h-5 w-5" />
                {t("settings.calendar")}
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "notifications"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <AlertIcon className="h-5 w-5" />
                {t("settings.notifications")}
              </button>
              <button
                onClick={() => setActiveTab("permissions")}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "permissions"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <LockIcon className="h-5 w-5" />
                {t("settings.permissions")}
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "calendar" && <CalendarSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "permissions" && <PermissionSettings />}
          </div>
        </div>
      </div>
    </>
  );
}

function GeneralSettings() {
  const { language, setLanguage, t } = useLanguage();
  const [dateFormat, setDateFormat] = useState("DD/MM/AAAA");

  useEffect(() => {
    const savedFormat = localStorage.getItem("dateFormat");
    if (savedFormat) setDateFormat(savedFormat);
  }, []);

  const handleSave = () => {
    localStorage.setItem("dateFormat", dateFormat);
    // Language já é salvo pelo contexto
    alert("Configurações gerais salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{t("settings.general")}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Preferências básicas da sua conta.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {t("settings.language")}
          </label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as "pt" | "en" | "es")}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900"
          >
            <option value="pt" className="dark:bg-gray-900">Português (Brasil)</option>
            <option value="en" className="dark:bg-gray-900">English (US)</option>
            <option value="es" className="dark:bg-gray-900">Español</option>
          </select>
        </div>
        
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Formato de Data
          </label>
          <select 
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900"
          >
            <option value="DD/MM/AAAA" className="dark:bg-gray-900">DD/MM/AAAA (31/12/2023)</option>
            <option value="MM/DD/AAAA" className="dark:bg-gray-900">MM/DD/AAAA (12/31/2023)</option>
            <option value="AAAA-MM-DD" className="dark:bg-gray-900">AAAA-MM-DD (2023-12-31)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={handleSave}
          className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}

function CalendarSettings() {
  const [allowConflict, setAllowConflict] = useState(true);
  const [requireProject, setRequireProject] = useState(false);
  const [eventDuration, setEventDuration] = useState("60");
  const { t } = useLanguage();

  useEffect(() => {
    const savedConflict = localStorage.getItem("allowConflict");
    const savedRequire = localStorage.getItem("requireProject");
    const savedDuration = localStorage.getItem("eventDuration");
    
    if (savedConflict !== null) setAllowConflict(savedConflict === "true");
    if (savedRequire !== null) setRequireProject(savedRequire === "true");
    if (savedDuration) setEventDuration(savedDuration);
  }, []);

  const handleSave = () => {
    localStorage.setItem("allowConflict", String(allowConflict));
    localStorage.setItem("requireProject", String(requireProject));
    localStorage.setItem("eventDuration", eventDuration);
    alert("Configurações de calendário salvas!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{t("settings.calendar")}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Defina como os eventos devem se comportar.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Permitir conflito de horário?</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Se desativado, o sistema bloqueará eventos no mesmo horário.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={allowConflict} onChange={() => setAllowConflict(!allowConflict)} className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Eventos obrigam projeto?</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Exigir que todo evento esteja vinculado a um projeto.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={requireProject} onChange={() => setRequireProject(!requireProject)} className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Duração padrão de evento
          </label>
          <select 
            value={eventDuration}
            onChange={(e) => setEventDuration(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900"
          >
            <option value="30" className="dark:bg-gray-900">30 minutos</option>
            <option value="60" className="dark:bg-gray-900">60 minutos</option>
            <option value="90" className="dark:bg-gray-900">90 minutos</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={handleSave}
          className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const { t } = useLanguage();
  const [emailNotif, setEmailNotif] = useState(true);
  const [systemNotif, setSystemNotif] = useState(true);
  const [reminderTime, setReminderTime] = useState("10");

  useEffect(() => {
    const savedEmail = localStorage.getItem("emailNotif");
    const savedSystem = localStorage.getItem("systemNotif");
    const savedReminder = localStorage.getItem("reminderTime");

    if (savedEmail !== null) setEmailNotif(savedEmail === "true");
    if (savedSystem !== null) setSystemNotif(savedSystem === "true");
    if (savedReminder) setReminderTime(savedReminder);
  }, []);

  const handleSave = () => {
    localStorage.setItem("emailNotif", String(emailNotif));
    localStorage.setItem("systemNotif", String(systemNotif));
    localStorage.setItem("reminderTime", reminderTime);
    alert("Preferências de notificação salvas!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{t("settings.notifications")}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie como você recebe alertas.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Notificações por Email</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Receba atualizações de projetos e convites.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Notificações no Sistema</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Alertas pop-up dentro do dashboard.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={systemNotif} onChange={() => setSystemNotif(!systemNotif)} className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Lembrete padrão antes do evento
          </label>
          <select 
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900"
          >
            <option value="10" className="dark:bg-gray-900">10 minutos antes</option>
            <option value="30" className="dark:bg-gray-900">30 minutos antes</option>
            <option value="60" className="dark:bg-gray-900">1 hora antes</option>
            <option value="1440" className="dark:bg-gray-900">1 dia antes</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={handleSave}
          className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}

function PermissionSettings() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{t("settings.permissions")}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Controle quem pode fazer o que no sistema.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-white/[0.02]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Papel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Acesso</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Ação</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-gray-800">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white/90">Admin</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Acesso Total</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-400">Padrão</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white/90">Gestor</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Criar Projetos, Gerenciar Times</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-brand-500 hover:text-brand-600">Editar</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white/90">Membro</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Visualizar, Editar Próprios Eventos</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-brand-500 hover:text-brand-600">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
// Force update
