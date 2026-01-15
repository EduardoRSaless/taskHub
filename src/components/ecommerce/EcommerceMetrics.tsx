import {
  GroupIcon,
  CalenderIcon,
  TimeIcon,
  TaskIcon,
} from "../../icons";
import { useData } from "../../context/DataContext";

export default function EcommerceMetrics() {
  const { projects, events, teams } = useData();

  // Cálculos em tempo real
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const eventsThisMonth = events.filter((e) => {
    const eventDate = new Date(e.start);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).length;

  const meetingsToday = events.filter((e) => {
    // Verifica se a data é hoje (string comparison YYYY-MM-DD)
    const eventDateStr = e.start.toString().split("T")[0];
    return eventDateStr === today;
  }).length;

  const activeProjects = projects.filter((p) => p.status === "Em Andamento").length;
  
  const totalTeams = teams.length;

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2">
      {/* <!-- Eventos no Mês --> */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <CalenderIcon className="h-5 w-5 text-gray-800 dark:text-white/90" />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Eventos Mês
          </span>
          <h4 className="font-bold text-gray-800 text-sm dark:text-white/90">
            {eventsThisMonth}
          </h4>
        </div>
      </div>

      {/* <!-- Reuniões Hoje --> */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <TimeIcon className="h-5 w-5 text-gray-800 dark:text-white/90" />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Eventos Hoje
          </span>
          <h4 className="font-bold text-gray-800 text-sm dark:text-white/90">
            {meetingsToday}
          </h4>
        </div>
      </div>

      {/* <!-- Projetos Ativos --> */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <TaskIcon className="h-5 w-5 text-gray-800 dark:text-white/90" />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Projetos Ativos
          </span>
          <h4 className="font-bold text-gray-800 text-sm dark:text-white/90">
            {activeProjects}
          </h4>
        </div>
      </div>

      {/* <!-- Times --> */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="h-5 w-5 text-gray-800 dark:text-white/90" />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Times
          </span>
          <h4 className="font-bold text-gray-800 text-sm dark:text-white/90">
            {totalTeams}
          </h4>
        </div>
      </div>
    </div>
  );
}
