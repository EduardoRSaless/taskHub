import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Modal } from "../components/ui/modal";
import ConfirmationModal from "../components/ui/modal/ConfirmationModal"; // Importar ConfirmationModal
import { useModal } from "../hooks/useModal";
import { PlusIcon, MoreDotIcon, TimeIcon, GroupIcon } from "../icons";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
import Badge from "../components/ui/badge/Badge";
import { useData, Project } from "../context/DataContext";

// Definir o tipo BadgeColor compatível com o componente Badge
type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

export default function Projects() {
  const { isOpen, openModal, closeModal } = useModal();
  const { projects, teams, addProject, updateProject, deleteProject, getProjectProgress } = useData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  // Estados do Formulário de Criação/Edição
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [projectTeamId, setProjectTeamId] = useState<string>("");
  const [projectStatus, setProjectStatus] = useState<Project["status"]>("Em Andamento");

  // Estados para Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === "Todos" || project.status === filter;
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectId(null);
    openModal();
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setProjectId(null);
    setProjectName("");
    setProjectDesc("");
    setProjectDate("");
    setProjectTeamId("");
    setProjectStatus("Em Andamento");
    openModal();
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(null);
    setProjectId(project.id);
    setProjectName(project.name);
    setProjectDesc(project.description);
    setProjectDate(project.dueDate);
    setProjectTeamId(project.teamId || "");
    setProjectStatus(project.status);
    openModal();
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDeleteId) {
      await deleteProject(projectToDeleteId);
      setIsDeleteModalOpen(false);
      setProjectToDeleteId(null);
      // Se estiver aberto no modal de detalhes, fecha também
      if (isOpen) closeModal();
    }
  };

  const handleSaveProject = () => {
    if (!projectName) return;

    const projectData: Omit<Project, "id" | "teamName"> = {
      name: projectName,
      description: projectDesc,
      status: projectStatus,
      teamId: projectTeamId,
      dueDate: projectDate,
    };

    if (projectId) {
      updateProject({ ...projectData, id: projectId, teamName: teams.find(t => t.id === projectTeamId)?.name || "Sem Time" });
    } else {
      addProject(projectData);
    }
    closeModal();
  };

  const getStatusColor = (status: string): BadgeColor => {
    switch (status) {
      case "Em Andamento": return "success";
      case "Concluído": return "success";
      case "Pausado": return "warning";
      case "Atrasado": return "error";
      default: return "light";
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-brand-500";
      case "Concluído": return "bg-green-500";
      case "Pausado": return "bg-orange-500";
      case "Atrasado": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <>
      <PageMeta
        title="Projetos | Dashboard"
        description="Gerencie seus projetos e prazos"
      />
      <PageBreadcrumb pageTitle="Projetos" />

      <div className="space-y-6">
        {/* Header: Filtros e Ações */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["Todos", "Em Andamento", "Concluído", "Pausado", "Atrasado"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === f
                    ? "bg-brand-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Buscar projeto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              />
            </div>
            <button
              onClick={handleCreateProject}
              className="flex items-center justify-center gap-0 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors shrink-0"
            >
              <PlusIcon className="h-4 w-1" />
              <span className="hidden sm:inline">Criar Projeto</span>
              <span className="sm:hidden">Novo</span>
            </button>
          </div>
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const progress = getProjectProgress(project.id);
            return (
              <ProjectCard 
                key={project.id} 
                project={project} 
                progress={progress}
                onClick={() => handleProjectClick(project)}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteClick(project.id)} // Usar handleDeleteClick
                statusColor={getStatusColor(project.status)}
                progressColor={getProgressBarColor(project.status)}
              />
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes/Criação/Edição */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 bg-white dark:bg-gray-900"> {/* Forçar bg dark */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {selectedProject ? selectedProject.name : (projectId ? "Editar Projeto" : "Novo Projeto")}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <span className="sr-only">Fechar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedProject ? (
            // MODO VISUALIZAÇÃO (Detalhes)
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge color={getStatusColor(selectedProject.status)}>{selectedProject.status}</Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <TimeIcon className="h-4 w-4" />
                  Prazo: {selectedProject.dueDate}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                {selectedProject.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Progresso (Baseado em Eventos)</span>
                  <span className="text-gray-500">{getProjectProgress(selectedProject.id)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(selectedProject.status)}`}
                    style={{ width: `${getProjectProgress(selectedProject.id)}%` }}
                  ></div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3 flex items-center gap-2">
                  <GroupIcon className="h-4 w-4 text-brand-500" />
                  Time Responsável
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{selectedProject.teamName}</p>
              </div>
              
              <div className="flex justify-end pt-4 gap-3">
                 <button
                   onClick={() => handleDeleteClick(selectedProject.id)}
                   className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                 >
                   Arquivar
                 </button>
                 <button 
                   onClick={() => handleEditProject(selectedProject)}
                   className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                 >
                   Editar Projeto
                 </button>
              </div>
            </div>
          ) : (
            // MODO EDIÇÃO / CRIAÇÃO
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Nome do Projeto
                </label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" 
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Descrição
                </label>
                <textarea 
                  rows={3} 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Data Final
                  </label>
                  <input 
                    type="date" 
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500" 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Status
                  </label>
                  <select 
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as Project["status"])}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
                  >
                    <option value="Em Andamento" className="dark:bg-gray-800">Em Andamento</option>
                    <option value="Concluído" className="dark:bg-gray-800">Concluído</option>
                    <option value="Pausado" className="dark:bg-gray-800">Pausado</option>
                    <option value="Atrasado" className="dark:bg-gray-800">Atrasado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Time Responsável
                </label>
                <select 
                  value={projectTeamId}
                  onChange={(e) => setProjectTeamId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
                >
                  <option value="" className="dark:bg-gray-800">Nenhum Time</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id} className="dark:bg-gray-800">{team.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleSaveProject}
                  className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                >
                  {projectId ? "Salvar Alterações" : "Criar Projeto"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Arquivar Projeto"
        message="Tem certeza que deseja arquivar este projeto? Esta ação não pode ser desfeita."
        confirmText="Arquivar"
      />
    </>
  );
}

function ProjectCard({ 
  project, 
  progress, 
  onClick, 
  onEdit, 
  onDelete, 
  statusColor, 
  progressColor 
}: { 
  project: Project; 
  progress: number; 
  onClick: () => void; 
  onEdit: () => void; 
  onDelete: () => void; 
  statusColor: BadgeColor; // Usar o tipo correto
  progressColor: string 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-500/50 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge color={statusColor}>{project.status}</Badge>
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
              className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-300" // Adicionado dark:text-gray-300
            >
              Editar
            </DropdownItem>
            <DropdownItem 
              onItemClick={() => { setIsDropdownOpen(false); onDelete(); }}
              className="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Arquivar
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-2 line-clamp-1">
        {project.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
        {project.description}
      </p>

      <div className="space-y-4 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{project.teamName}</span> {/* Usar teamName */}
          <span>{project.dueDate}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-gray-700 dark:text-gray-300">Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className={`h-1.5 rounded-full ${progressColor}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
