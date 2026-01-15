import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import { PlusIcon, GroupIcon, MoreDotIcon, UserIcon, CalenderIcon, TaskIcon } from "../icons";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  nextEvent: string;
  projectsCount: number;
  status: "Active" | "Inactive";
}

export default function Teams() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Mock Data
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Time UI/UX Design",
      description: "Responsável pela interface e experiência do usuário.",
      members: [
        { id: "1", name: "Alice Silva", role: "Lead Designer", avatar: "https://i.pravatar.cc/150?u=1" },
        { id: "2", name: "Bob Santos", role: "UX Researcher", avatar: "https://i.pravatar.cc/150?u=2" },
        { id: "3", name: "Carol Lima", role: "UI Designer", avatar: "https://i.pravatar.cc/150?u=3" },
      ],
      nextEvent: "Review de Design - Amanhã, 14:00",
      projectsCount: 3,
      status: "Active",
    },
    {
      id: "2",
      name: "Time Desenvolvimento",
      description: "Equipe de engenharia frontend e backend.",
      members: [
        { id: "4", name: "David Costa", role: "Tech Lead", avatar: "https://i.pravatar.cc/150?u=4" },
        { id: "5", name: "Eva Pereira", role: "Frontend Dev", avatar: "https://i.pravatar.cc/150?u=5" },
        { id: "6", name: "Frank Souza", role: "Backend Dev", avatar: "https://i.pravatar.cc/150?u=6" },
        { id: "7", name: "Grace Oliveira", role: "DevOps", avatar: "https://i.pravatar.cc/150?u=7" },
      ],
      nextEvent: "Daily Standup - Hoje, 09:00",
      projectsCount: 5,
      status: "Active",
    },
    {
      id: "3",
      name: "Time Marketing",
      description: "Campanhas, redes sociais e branding.",
      members: [
        { id: "8", name: "Hugo Alves", role: "Marketing Manager", avatar: "https://i.pravatar.cc/150?u=8" },
        { id: "9", name: "Ivy Martins", role: "Content Creator", avatar: "https://i.pravatar.cc/150?u=9" },
      ],
      nextEvent: "Planejamento Q3 - Sexta, 10:00",
      projectsCount: 2,
      status: "Active",
    },
  ]);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    openModal();
  };

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    openModal();
  };

  return (
    <>
      <PageMeta
        title="Times | Dashboard"
        description="Gerencie seus times e colaboradores"
      />
      <PageBreadcrumb pageTitle="Times" />

      <div className="space-y-6">
        {/* Header e Ações */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Visão Geral dos Times
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie membros, projetos e agendas de cada equipe.
            </p>
          </div>
          <button
            onClick={handleCreateTeam}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            <PlusIcon className="h-5 w-0" />
            Criar Novo Time
          </button>
        </div>

        {/* Grid de Times */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} onClick={() => handleTeamClick(team)} />
          ))}
        </div>
      </div>

      {/* Modal de Detalhes/Criação */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {selectedTeam ? selectedTeam.name : "Criar Novo Time"}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <span className="sr-only">Fechar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedTeam ? (
            <div className="space-y-6">
              {/* Detalhes do Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 mb-1">
                    <GroupIcon className="h-4 w-4 text-brand-500" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Membros</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-white/90">{selectedTeam.members.length}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 mb-1">
                    <TaskIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Projetos</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-white/90">{selectedTeam.projectsCount}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 mb-1">
                    <CalenderIcon className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Próximo Evento</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90 line-clamp-1" title={selectedTeam.nextEvent}>
                    {selectedTeam.nextEvent.split(" - ")[0]}
                  </p>
                </div>
              </div>

              {/* Lista de Membros */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">Membros do Time</h4>
                  <button className="text-xs font-medium text-brand-500 hover:text-brand-600">
                    + Adicionar Membro
                  </button>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {selectedTeam.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.03]">
                      <div className="flex items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <span className="sr-only">Remover</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formulário de Criação */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nome do Time
                </label>
                <input
                  type="text"
                  placeholder="Ex: Time de Vendas"
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  placeholder="Objetivo e responsabilidades do time..."
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
                />
              </div>
              <div className="pt-4">
                <button className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
                  Criar Time
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

function TeamCard({ team, onClick }: { team: Team; onClick: () => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-500/50 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
          <GroupIcon className="h-6 w-6" />
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.05] dark:hover:text-gray-200"
          >
            <MoreDotIcon className="h-5 w-5" />
          </button>
          <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} className="w-40 p-2 right-0 top-full">
            <DropdownItem className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5">
              Editar
            </DropdownItem>
            <DropdownItem className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
              Arquivar
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-1">
        {team.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
        {team.description}
      </p>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex -space-x-2">
            {team.members.slice(0, 3).map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 object-cover"
                title={member.name}
              />
            ))}
            {team.members.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-300">
                +{team.members.length - 3}
              </div>
            )}
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            team.status === "Active" 
              ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}>
            {team.status === "Active" ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 dark:bg-white/[0.03]">
          <CalenderIcon className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
            {team.nextEvent}
          </span>
        </div>
      </div>
    </div>
  );
}
