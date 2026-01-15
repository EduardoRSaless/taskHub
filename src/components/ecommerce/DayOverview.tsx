import React from "react";
import { useData } from "../../context/DataContext";

export default function DayOverview() {
  const { events } = useData();

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Eventos de Hoje
  const todayEvents = events.filter((e) => {
    // Tenta criar a data de várias formas
    const eventDate = new Date(e.start);
    if (isNaN(eventDate.getTime())) return false;
    
    const eventDateStr = eventDate.toISOString().split("T")[0];
    return eventDateStr === todayStr;
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Próximas Reuniões (Hoje, mas horário futuro)
  const upcomingMeetings = todayEvents.filter((e) => {
    const eventTime = new Date(e.start).getTime();
    return eventTime > now.getTime() && e.extendedProps.status !== "completed";
  });

  // Alertas (Atrasados: data/hora passada e status não concluído)
  const alerts = events.filter((e) => {
    const eventDate = new Date(e.start);
    if (isNaN(eventDate.getTime())) return false;

    // É atrasado se:
    // 1. O horário já passou
    // 2. O status não é 'completed'
    return eventDate.getTime() < now.getTime() && e.extendedProps.status !== "completed";
  }).sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()) // Mais recentes primeiro
  .slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Visão rápida do dia
      </h3>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:divide-x lg:divide-gray-100 dark:lg:divide-gray-800">
        {/* Eventos de Hoje */}
        <div className="lg:pr-6">
          <h4 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            📅 Eventos de hoje
          </h4>
          {todayEvents.length > 0 ? (
            <ul className="space-y-3">
              {todayEvents.map((event) => (
                <li key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${event.extendedProps.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className={`text-sm font-medium text-gray-800 dark:text-white/90 ${event.extendedProps.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                      {event.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">Nenhum evento para hoje.</p>
          )}
        </div>

        {/* Próximas Reuniões */}
        <div className="lg:px-6">
          <h4 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            ⏰ Próximas reuniões
          </h4>
          {upcomingMeetings.length > 0 ? (
            <ul className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <li
                  key={meeting.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{meeting.extendedProps.team || "Geral"}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {new Date(meeting.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">Sem mais reuniões hoje.</p>
          )}
        </div>

        {/* Compromissos Atrasados ou em Conflito */}
        <div className="lg:pl-6">
          <h4 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            ⚠️ Atenção (Atrasados)
          </h4>
          {alerts.length > 0 ? (
            <ul className="space-y-3">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 truncate max-w-[150px]">
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(alert.start).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                    Atrasado
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">Tudo em dia!</p>
          )}
        </div>
      </div>
    </div>
  );
}
