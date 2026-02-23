import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import esLocale from "@fullcalendar/core/locales/es";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import { PlusIcon, CheckCircleIcon, GroupIcon, TaskIcon } from "../icons";
import { useData, CalendarEvent } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import "./Calendar.css";

export default function Calendar() {
  const { events, addEvent, updateEvent, deleteEvent, toggleEventCompletion, projects } = useData();
  const { language } = useLanguage();
  const calendarRef = useRef<FullCalendar>(null);

  // Estados do Modal
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Campos do Formulário
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventCategory, setEventCategory] = useState("Projeto");
  const [eventDescription, setEventDescription] = useState("");
  const [eventTeam, setEventTeam] = useState("");
  const [eventProject, setEventProject] = useState("");

  // Filtros
  const [filters, setFilters] = useState({
    Projeto: true,
    Time: true,
    Pessoal: true,
    Outros: true,
  });

  const categories = {
    Projeto: "bg-blue-500 border-blue-500",
    Time: "bg-green-500 border-green-500",
    Pessoal: "bg-purple-500 border-purple-500",
    Outros: "bg-orange-500 border-orange-500",
  };

  const availableTeams = [
    "Todos os Integrantes",
    "Time UI/UX Design",
    "Time Desenvolvimento",
    "Time Marketing",
    "Time Gestão",
    "Time QA/Testes"
  ];

  const getCalendarLocale = () => {
    switch (language) {
      case "pt": return "pt-br";
      case "es": return "es";
      default: return "en";
    }
  };

  useEffect(() => {
    const loadViewPreference = () => {
      const savedView = localStorage.getItem("calendarDefaultView");
      if (savedView && calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(savedView);
      }
    };
    loadViewPreference();
    window.addEventListener("storage", loadViewPreference);
    return () => window.removeEventListener("storage", loadViewPreference);
  }, []);

  const filteredEvents = events.filter((event) => 
    filters[event.extendedProps.category as keyof typeof filters]
  );

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr.split("T")[0]);
    setEventEndDate(selectInfo.endStr ? selectInfo.endStr.split("T")[0] : selectInfo.startStr.split("T")[0]);
    
    if (selectInfo.startStr.includes("T")) {
      setEventStartTime(selectInfo.startStr.split("T")[1].substring(0, 5));
    }
    if (selectInfo.endStr && selectInfo.endStr.includes("T")) {
      setEventEndTime(selectInfo.endStr.split("T")[1].substring(0, 5));
    }
    
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEventId(event.id);
    setEventTitle(event.title);
    
    if (event.start) {
      setEventStartDate(event.start.toISOString().split("T")[0]);
      setEventStartTime(event.start.toTimeString().substring(0, 5));
    }
    
    if (event.end) {
      setEventEndDate(event.end.toISOString().split("T")[0]);
      setEventEndTime(event.end.toTimeString().substring(0, 5));
    } else {
      setEventEndDate(event.start?.toISOString().split("T")[0] || "");
      setEventEndTime("");
    }

    setEventCategory(event.extendedProps.category);
    setEventDescription(event.extendedProps.description || "");
    setEventTeam(event.extendedProps.team || "");
    setEventProject(event.extendedProps.projectId || "");
    openModal();
  };

  const handleSaveEvent = () => {
    if (!eventTitle || !eventStartDate) return;

    let startISO = eventStartDate;
    if (eventStartTime) startISO += `T${eventStartTime}:00`;

    let endISO = eventEndDate;
    if (eventEndTime) endISO += `T${eventEndTime}:00`;
    else if (!eventEndTime && eventEndDate === eventStartDate) endISO = "";

    const eventData: CalendarEvent = {
      id: selectedEventId || Date.now().toString(),
      title: eventTitle,
      start: startISO,
      end: endISO || undefined,
      allDay: !eventStartTime,
      extendedProps: { 
        category: eventCategory, 
        description: eventDescription, 
        team: eventTeam,
        projectId: eventProject,
        status: selectedEventId ? events.find(e => e.id === selectedEventId)?.extendedProps.status || "pending" : "pending"
      },
    };

    if (selectedEventId) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    closeModal();
    resetModalFields();
  };

  const handleDelete = () => {
    if (selectedEventId) {
      deleteEvent(selectedEventId);
      closeModal();
      resetModalFields();
    }
  };

  const handleToggleComplete = () => {
    if (selectedEventId) {
      toggleEventCompletion(selectedEventId);
      closeModal();
    }
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventStartTime("");
    setEventEndDate("");
    setEventEndTime("");
    setEventCategory("Projeto");
    setEventDescription("");
    setEventTeam("");
    setEventProject("");
    setSelectedEventId(null);
  };

  const toggleFilter = (category: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <>
      <PageMeta
        title="Calendário | Dashboard"
        description="Gerencie seus eventos e tarefas"
      />
      
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full shrink-0 space-y-6 lg:w-[280px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <button
              onClick={() => { resetModalFields(); openModal(); }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            >
              <PlusIcon className="h-5 w-0 shrink-0" />
              <span>Criar Evento</span>
            </button>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                Filtros
              </h3>
              <div className="space-y-2">
                {Object.keys(categories).map((cat) => (
                  <label key={cat} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-brand-500 checked:bg-brand-500 dark:border-gray-600 dark:checked:border-brand-500"
                        checked={filters[cat as keyof typeof filters]}
                        onChange={() => toggleFilter(cat as keyof typeof filters)}
                      />
                      <CheckCircleIcon className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className={`h-2.5 w-2.5 rounded-full ${categories[cat as keyof typeof categories].split(" ")[0]}`}></span>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Mini Lista */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hidden lg:block">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
              Próximos Eventos
            </h3>
            <div className="space-y-4">
              {filteredEvents.slice(0, 3).map((evt) => (
                <div key={evt.id} className="flex gap-3">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${categories[evt.extendedProps.category as keyof typeof categories].split(" ")[0]} ${evt.extendedProps.status === 'completed' ? 'opacity-50' : ''}`}></div>
                  <div className={evt.extendedProps.status === 'completed' ? 'opacity-50' : ''}>
                    <h4 className={`text-sm font-medium text-gray-800 dark:text-white/90 line-clamp-1 ${evt.extendedProps.status === 'completed' ? 'line-through' : ''}`}>
                      {evt.title}
                    </h4>
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {evt.start?.toString().split("T")[0]} 
                      </p>
                      {evt.extendedProps.team && (
                        <p className="text-[10px] text-brand-500 font-medium mt-0.5">
                          {evt.extendedProps.team}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <p className="text-xs text-gray-400">Nenhum evento encontrado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Calendário Principal */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="custom-calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locales={[ptBrLocale, esLocale]}
              locale={getCalendarLocale()}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
              }}
              events={filteredEvents}
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              dayMaxEvents={true}
              eventContent={(eventInfo) => (
                <div className={`flex flex-col gap-0.5 px-3 py-1 rounded-sm w-30 overflow-hidden ${categories[eventInfo.event.extendedProps.category as keyof typeof categories].split(" ")[0]} text-white text-xs border-l-2 border-white/20 ${eventInfo.event.extendedProps.status === 'completed' ? 'opacity-60 grayscale' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold truncate">{eventInfo.timeText}</span>
                    {eventInfo.event.extendedProps.status === 'completed' && (
                      <CheckCircleIcon className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span className={`truncate font-medium ${eventInfo.event.extendedProps.status === 'completed' ? 'line-through' : ''}`}>
                    {eventInfo.event.title}
                  </span>
                </div>
              )}
              height="auto"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={true}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] p-6">
        <div className="flex flex-col">
          {/* Header do Modal */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {selectedEventId ? "Editar Evento" : "Novo Evento"}
              </h3>
              {selectedEventId && (
                <button 
                  onClick={handleToggleComplete}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors w-fit ${
                    events.find(e => e.id === selectedEventId)?.extendedProps.status === 'completed'
                      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  {events.find(e => e.id === selectedEventId)?.extendedProps.status === 'completed' ? "Concluído" : "Marcar Concluído"}
                </button>
              )}
            </div>
            
            <button 
              onClick={closeModal} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <span className="sr-only">Fechar</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Título
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              />
            </div>


            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 flex items-center gap-2">
                <TaskIcon className="h-4 w-4 text-blue-500" />
                Vincular a Projeto
              </label>
              <select
                value={eventProject}
                onChange={(e) => setEventProject(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              >
                <option value="">Nenhum Projeto</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id} className="dark:bg-gray-800">
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seleção de Time */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 flex items-center gap-2">
                <GroupIcon className="h-4 w-4 text-brand-500" />
                Notificar Time
              </label>
              <select
                value={eventTeam}
                onChange={(e) => setEventTeam(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              >
                <option value="" disabled>Selecione um time...</option>
                {availableTeams.map((team) => (
                  <option key={team} value={team} className="dark:bg-gray-800">
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Datas e Horas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Início</label>
                <input type="date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Hora</label>
                <input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Fim</label>
                <input type="date" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Hora</label>
                <input type="time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(categories).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEventCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      eventCategory === cat
                        ? `${categories[cat as keyof typeof categories].split(" ")[0]} text-white`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Descrição</label>
              <textarea rows={3} value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {selectedEventId && (
              <button onClick={handleDelete} className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                Excluir
              </button>
            )}
            <button onClick={closeModal} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancelar
            </button>
            <button onClick={handleSaveEvent} className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
