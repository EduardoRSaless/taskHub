import { useData } from "../../context/DataContext";

export default function ImportantAlerts() {
  const { projects } = useData();

  // Filtrar projetos atrasados ou com prazo hoje
  const today = new Date().toISOString().split("T")[0];

  const alerts = projects.filter(p => {
    if (!p.dueDate) return false;
    return (p.status === "Atrasado") || (p.dueDate === today && p.status !== "Concluído");
  }).slice(0, 3); // Pegar os 3 primeiros

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Alertas Importantes
        </h3>
        <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((project) => (
            <div key={project.id} className="flex items-start gap-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm dark:bg-gray-800 shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {project.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {project.status === "Atrasado" ? "Projeto atrasado!" : "Vence hoje!"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 mb-3 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/20">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">Tudo sob controle!</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Nenhum alerta pendente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
