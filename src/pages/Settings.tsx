import { useState } from "react";
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
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"> {/* Alterado para dark:bg-gray-900 */}
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
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"> {/* Alterado para dark:bg-gray-900 */}
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
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900" // Removido bg-transparent, adicionado bg-white e dark:bg-gray-900
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
          <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900">
            <option className="dark:bg-gray-900">DD/MM/AAAA (31/12/2023)</option>
            <option className="dark:bg-gray-900">MM/DD/AAAA (12/31/2023)</option>
            <option className="dark:bg-gray-900">AAAA-MM-DD (2023-12-31)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}

function CalendarSettings() {
  const [allowConflict, setAllowConflict] = useState(true);
  const [requireProject, setRequireProject] = useState(false);
  const { t } = useLanguage();

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
          <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900">
            <option className="dark:bg-gray-900">30 minutos</option>
            <option className="dark:bg-gray-900">60 minutos</option>
            <option className="dark:bg-gray-900">90 minutos</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          {t("settings.save")}
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const { t } = useLanguage();
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
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Notificações no Sistema</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Alertas pop-up dentro do dashboard.</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:border-gray-600"></div>
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Lembrete padrão antes do evento
          </label>
          <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900">
            <option className="dark:bg-gray-900">10 minutos antes</option>
            <option className="dark:bg-gray-900">30 minutos antes</option>
            <option className="dark:bg-gray-900">1 hora antes</option>
            <option className="dark:bg-gray-900">1 dia antes</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <button className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
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
