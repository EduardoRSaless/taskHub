import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { useData } from "../../context/DataContext";
import { AlertIcon, CalenderIcon, TaskIcon } from "../../icons";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const { events, projects } = useData();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const newNotifications: any[] = [];

    // 1. Eventos Próximos (Hoje)
    events.forEach((e) => {
      const eventDate = new Date(e.start);
      const eventDateStr = eventDate.toISOString().split("T")[0];

      if (eventDateStr === todayStr && e.extendedProps.status !== "completed") {
        const diffMs = eventDate.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins > 0 && diffMins <= 60) {
          newNotifications.push({
            id: `evt-${e.id}`,
            type: "event",
            title: "Reunião em breve",
            message: `${e.title} começa em ${diffMins} min`,
            time: `${diffMins} min ago`, // Simplificado
            icon: <CalenderIcon className="h-5 w-5 text-blue-500" />,
            color: "bg-blue-500"
          });
        } else if (diffMins <= 0 && diffMins > -60) {
           newNotifications.push({
            id: `evt-${e.id}`,
            type: "event",
            title: "Reunião em andamento",
            message: `${e.title} já começou`,
            time: "Agora",
            icon: <CalenderIcon className="h-5 w-5 text-green-500" />,
            color: "bg-green-500"
          });
        }
      }
    });

    // 2. Projetos com Prazo Próximo
    projects.forEach((p) => {
      if (p.status === "Em Andamento" && p.dueDate) {
        if (p.dueDate === todayStr) {
          newNotifications.push({
            id: `proj-${p.id}`,
            type: "project",
            title: "Prazo Hoje!",
            message: `Projeto "${p.name}" vence hoje.`,
            time: "Hoje",
            icon: <TaskIcon className="h-5 w-5 text-red-500" />,
            color: "bg-red-500"
          });
        } else if (p.dueDate === tomorrowStr) {
          newNotifications.push({
            id: `proj-${p.id}`,
            type: "project",
            title: "Prazo Amanhã",
            message: `Projeto "${p.name}" vence amanhã.`,
            time: "Amanhã",
            icon: <TaskIcon className="h-5 w-5 text-orange-500" />,
            color: "bg-orange-500"
          });
        }
      }
    });

    setNotifications(newNotifications);
    setNotifying(newNotifications.length > 0);

  }, [events, projects]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
    if (!isOpen) setNotifying(false); // Limpa bolinha ao abrir
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <AlertIcon className="h-5 w-5" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notificações
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <li key={notif.id}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0">
                    {notif.icon}
                    <span className={`absolute bottom-0 right-0 z-10 h-2.5 w-2.5 rounded-full border-[1.5px] border-white ${notif.color} dark:border-gray-900`}></span>
                  </span>

                  <span className="block">
                    <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {notif.title}
                      </span>
                      <span className="block text-xs mt-0.5">
                        {notif.message}
                      </span>
                    </span>

                    <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span>{notif.type === 'event' ? 'Calendário' : 'Projeto'}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{notif.time}</span>
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Nenhuma notificação nova.
            </li>
          )}
        </ul>

        <Link
          to="/calendar"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Ver Calendário
        </Link>
      </Dropdown>
    </div>
  );
}
// Force update
