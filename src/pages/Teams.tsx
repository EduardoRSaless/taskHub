import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import { PlusIcon, GroupIcon, MoreDotIcon, UserIcon, CalenderIcon, TaskIcon } from "../icons";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
// import Badge from "../components/ui/badge/Badge"; // Removido Badge não usado
import { useData, Team } from "../context/DataContext";
import { User } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

export default function Teams() {
  const { isOpen, openModal, closeModal } = useModal();
  const { teams, addTeam, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam } = useData();
  const { user: loggedInUser } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Estados do Formulário de Criação/Edição de Time
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");

  // Estados do Modal de Membros
  const { isOpen: isMembersModalOpen, openModal: openMembersModal, closeModal: closeMembersModal } = useModal();
  const [teamToManageMembers, setTeamToManageMembers] = useState<Team | null>(null);
  const [userEmailToAdd, setUserEmailToAdd] = useState<string>("");
  const [memberActionError, setMemberActionError] = useState<string>("");

  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    if (loggedInUser) {
      // Mock de usuários com tipagem correta para role
      const mockUsers: User[] = [
        loggedInUser,
        { id: "u1", name: "Eduardo Silva", email: "eduardo@empresa.com", role: "Admin", avatar: "https://i.pravatar.cc/150?u=1" },
        { id: "u2", name: "Ana Costa", email: "ana@empresa.com", role: "Manager", avatar: "https://i.pravatar.cc/150?u=2" },
        { id: "u3", name: "Carlos Lima", email: "carlos@empresa.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=3" },
        { id: "u4", name: "Beatriz Souza", email: "beatriz@empresa.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=4" },
        { id: "u5", name: "João Pereira", email: "joao@empresa.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=5" },
      ];

      setAllUsers(mockUsers.filter((user, index, self) => 
        index === self.findIndex((u) => u.id === user.id)
      ));
    }
  }, [loggedInUser]);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setTeamId(null);
    openModal();
  };

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setTeamId(null);
    setTeamName("");
    setTeamDescription("");
    openModal();
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(null);
    setTeamId(team.id);
    setTeamName(team.name);
    setTeamDescription(team.description);
    openModal();
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este time?")) {
      deleteTeam(id);
    }
  };

  const handleSaveTeam = () => {
    if (!teamName) return;

    const teamData: Team = {
      id: teamId || "",
      name: teamName,
      description: teamDescription,
      members: selectedTeam?.members || [],
    };

    if (teamId) {
      updateTeam({ ...teamData, id: teamId });
    } else {
      addTeam(teamData);
    }
    closeModal();
  };

  const handleManageMembers = (team: Team) => {
    setTeamToManageMembers(team);
    setUserEmailToAdd("");
    setMemberActionError("");
    openMembersModal();
  };

  const handleAddMember = async () => {
    if (teamToManageMembers && userEmailToAdd) {
      try {
        await addMemberToTeam(teamToManageMembers.id, userEmailToAdd);
        setUserEmailToAdd("");
        setMemberActionError("");
      } catch (error: any) {
        setMemberActionError(error.message || "Erro ao adicionar membro.");
      }
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (teamToManageMembers) {
      const memberToRemove = allUsers.find(u => u.id === userId);
      if (memberToRemove && confirm(`Remover ${memberToRemove.email} do time?`)) {
        try {
          await removeMemberFromTeam(teamToManageMembers.id, memberToRemove.email);
          setMemberActionError("");
        } catch (error: any) {
          setMemberActionError(error.message || "Erro ao remover membro.");
        }
      }
    }
  };

  const getUserById = (userId: string) => allUsers.find(u => u.id === userId);

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
            <PlusIcon className="h-5 w-5" />
            Criar Novo Time
          </button>
        </div>

        {/* Grid de Times */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              onClick={() => handleTeamClick(team)}
              onEdit={() => handleEditTeam(team)}
              onDelete={() => handleDeleteTeam(team.id)}
              onManageMembers={() => handleManageMembers(team)}
              allUsers={allUsers}
            />
          ))}
        </div>
      </div>

      {/* Modal de Detalhes/Criação/Edição de Time */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {selectedTeam ? selectedTeam.name : (teamId ? "Editar Time" : "Criar Novo Time")}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <span className="sr-only">Fechar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedTeam ? (
            // MODO VISUALIZAÇÃO (Detalhes)
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                {selectedTeam.description}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-brand-500" />
                    Membros do Time ({selectedTeam.members.length})
                  </h4>
                  <div className="flex -space-x-2">
                    {selectedTeam.members.slice(0, 3).map((memberId, i) => {
                      const member = getUserById(memberId);
                      return member ? (
                        <img key={i} src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                      ) : null;
                    })}
                    {selectedTeam.members.length > 3 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-300">
                        +{selectedTeam.members.length - 3}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleManageMembers(selectedTeam)}
                    className="mt-3 text-xs font-medium text-brand-500 hover:text-brand-600"
                  >
                    Gerenciar Membros
                  </button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3 flex items-center gap-2">
                    <TaskIcon className="h-4 w-4 text-blue-500" />
                    Projetos Vinculados
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {/* Aqui você listaria projetos reais */}
                    Nenhum projeto vinculado (funcionalidade futura)
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                 <button 
                   onClick={() => handleEditTeam(selectedTeam)}
                   className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                 >
                   Editar Time
                 </button>
              </div>
            </div>
          ) : (
            // MODO EDIÇÃO / CRIAÇÃO
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nome do Time
                </label>
                <input 
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Descrição
                </label>
                <textarea 
                  rows={3} 
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" 
                />
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleSaveTeam}
                  className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                >
                  {teamId ? "Salvar Alterações" : "Criar Time"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Gerenciar Membros */}
      <Modal isOpen={isMembersModalOpen} onClose={closeMembersModal} className="max-w-[500px] p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Gerenciar Membros do Time: {teamToManageMembers?.name}
        </h3>
        
        <div className="space-y-4">
          {/* Adicionar Membro */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Adicionar Membro por E-mail
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={userEmailToAdd}
                onChange={(e) => setUserEmailToAdd(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              />
              <button 
                onClick={handleAddMember}
                className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                Adicionar
              </button>
            </div>
            {memberActionError && (
              <p className="text-sm text-red-500 mt-2">{memberActionError}</p>
            )}
          </div>

          {/* Lista de Membros Atuais */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-2">
              Membros Atuais ({teamToManageMembers?.members.length || 0})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {teamToManageMembers?.members.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum membro neste time.</p>
              )}
              {teamToManageMembers?.members.map(memberId => {
                const member = getUserById(memberId);
                return member ? (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-2 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="sr-only">Remover</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function TeamCard({ team, onClick, onEdit, onDelete, onManageMembers, allUsers }: { team: Team; onClick: () => void; onEdit: () => void; onDelete: () => void; onManageMembers: () => void; allUsers: User[] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper para obter o objeto User completo a partir do ID
  const getUserById = (userId: string) => allUsers.find(u => u.id === userId);

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
            <DropdownItem 
              onItemClick={() => { setIsDropdownOpen(false); onEdit(); }}
              className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5"
            >
              Editar
            </DropdownItem>
            <DropdownItem 
              onItemClick={() => { setIsDropdownOpen(false); onManageMembers(); }}
              className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5"
            >
              Gerenciar Membros
            </DropdownItem>
            <DropdownItem 
              onItemClick={() => { setIsDropdownOpen(false); onDelete(); }}
              className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Excluir
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
            {team.members.slice(0, 3).map((memberId, i) => {
              const member = getUserById(memberId);
              return member ? (
                <img
                  key={i}
                  src={member.avatar}
                  alt={member.name}
                  className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 object-cover"
                  title={member.name}
                />
              ) : null;
            })}
            {team.members.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-300">
                +{team.members.length - 3}
              </div>
            )}
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-100 text-success-800 dark:bg-success-500/10 dark:text-success-400`}>
            Ativo {/* Status mockado */}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 dark:bg-white/[0.03]">
          <CalenderIcon className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
            Próximo evento (mock)
          </span>
        </div>
      </div>
    </div>
  );
}
