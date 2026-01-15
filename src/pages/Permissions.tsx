import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import { PlusIcon, LockIcon, UserIcon, CheckCircleIcon } from "../icons";
import Badge from "../components/ui/badge/Badge";

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  color: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function Permissions() {
  const { isOpen, openModal, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState("roles");

  // Estados para Edição de Role
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [roleColor, setRoleColor] = useState("light");

  // Mock Data - Roles
  const [roles, setRoles] = useState<Role[]>([
    { id: "1", name: "Admin", description: "Acesso total ao sistema e configurações.", usersCount: 2, color: "success" },
    { id: "2", name: "Manager", description: "Gerencia times, projetos e relatórios.", usersCount: 5, color: "warning" },
    { id: "3", name: "Member", description: "Visualiza e edita suas próprias tarefas.", usersCount: 12, color: "light" },
  ]);

  // Mock Data - Users
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Eduardo Silva", email: "eduardo@empresa.com", role: "Admin", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "2", name: "Ana Costa", email: "ana@empresa.com", role: "Manager", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "3", name: "Carlos Lima", email: "carlos@empresa.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "4", name: "Beatriz Souza", email: "beatriz@empresa.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=4" },
  ]);

  // Mock Data - Matrix
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    "Projetos-Admin": true, "Projetos-Manager": true, "Projetos-Member": true,
    "Times-Admin": true, "Times-Manager": true, "Times-Member": false,
    "Calendário-Admin": true, "Calendário-Manager": true, "Calendário-Member": true,
    "Configurações-Admin": true, "Configurações-Manager": false, "Configurações-Member": false,
    "Usuários-Admin": true, "Usuários-Manager": false, "Usuários-Member": false,
  });

  // Handlers
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description);
    setRoleColor(role.color);
    openModal();
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setRoleName("");
    setRoleDesc("");
    setRoleColor("light");
    openModal();
  };

  const handleSaveRole = () => {
    if (!roleName) return;

    if (selectedRole) {
      setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, name: roleName, description: roleDesc, color: roleColor } : r));
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: roleName,
        description: roleDesc,
        usersCount: 0,
        color: roleColor
      };
      setRoles([...roles, newRole]);
    }
    closeModal();
  };

  const handleTogglePermission = (resource: string, role: string) => {
    const key = `${resource}-${role}`;
    setMatrix(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangeUserRole = (userId: string, newRole: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    // Atualizar contagem (simplificado)
    const oldRoleName = users.find(u => u.id === userId)?.role;
    setRoles(roles.map(r => {
      if (r.name === newRole) return { ...r, usersCount: r.usersCount + 1 };
      if (r.name === oldRoleName) return { ...r, usersCount: r.usersCount - 1 };
      return r;
    }));
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Remover usuário?")) {
      const user = users.find(u => u.id === userId);
      setUsers(users.filter(u => u.id !== userId));
      if (user) {
        setRoles(roles.map(r => r.name === user.role ? { ...r, usersCount: r.usersCount - 1 } : r));
      }
    }
  };

  return (
    <>
      <PageMeta
        title="Permissões | Dashboard"
        description="Gerencie papéis e acessos dos usuários"
      />
      <PageBreadcrumb pageTitle="Permissões e Acesso" />

      <div className="space-y-6">
        {/* Tabs de Navegação */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab("roles")}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === "roles"
                  ? "border-b-2 border-brand-500 text-brand-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Papéis (Roles)
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === "matrix"
                  ? "border-b-2 border-brand-500 text-brand-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Matriz de Permissões
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "border-b-2 border-brand-500 text-brand-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Usuários
            </button>
          </nav>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === "roles" && (
          <RolesTab 
            roles={roles} 
            onEdit={handleEditRole} 
            onCreate={handleCreateRole} 
          />
        )}
        {activeTab === "matrix" && (
          <PermissionMatrixTab 
            roles={roles.map(r => r.name)} 
            matrix={matrix} 
            onToggle={handleTogglePermission} 
          />
        )}
        {activeTab === "users" && (
          <UsersTab 
            users={users} 
            roles={roles} 
            onChangeRole={handleChangeUserRole} 
            onRemove={handleRemoveUser} 
          />
        )}
      </div>

      {/* Modal de Edição/Criação de Role */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] p-6">
        <div className="flex flex-col">
          <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
            {selectedRole ? "Editar Papel" : "Novo Papel"}
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Defina os detalhes do nível de acesso.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Nome do Papel
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Descrição
              </label>
              <textarea
                rows={3}
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Cor do Badge
              </label>
              <select
                value={roleColor}
                onChange={(e) => setRoleColor(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500"
              >
                <option value="light">Cinza (Padrão)</option>
                <option value="success">Verde (Sucesso)</option>
                <option value="warning">Amarelo (Atenção)</option>
                <option value="error">Vermelho (Erro)</option>
                <option value="info">Azul (Info)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={closeModal}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveRole}
              className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function RolesTab({ roles, onEdit, onCreate }: { roles: Role[], onEdit: (r: Role) => void, onCreate: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {roles.map((role) => (
        <div key={role.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <Badge color={role.color}>{role.name}</Badge>
            <div className="flex -space-x-2">
              {[...Array(Math.min(3, role.usersCount))].map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 dark:border-gray-800 dark:bg-gray-700"></div>
              ))}
              {role.usersCount > 3 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  +{role.usersCount - 3}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10 line-clamp-2">
            {role.description}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {role.usersCount} Usuários
            </span>
            <button 
              onClick={() => onEdit(role)}
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Editar Permissões
            </button>
          </div>
        </div>
      ))}
      
      <button 
        onClick={onCreate}
        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-colors hover:border-brand-500 hover:bg-brand-50/50 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-brand-500/30"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-3 dark:bg-gray-800">
          <PlusIcon className="h-6 w-6 text-brand-500" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Criar Novo Papel</span>
      </button>
    </div>
  );
}

function PermissionMatrixTab({ roles, matrix, onToggle }: { roles: string[], matrix: Record<string, Record<string, boolean>>, onToggle: (res: string, role: string) => void }) {
  const resources = ["Projetos", "Times", "Calendário", "Configurações", "Usuários"];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Recurso</th>
              {roles.map((role) => (
                <th key={role} className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {resources.map((resource) => (
              <tr key={resource}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white/90">
                  {resource}
                </td>
                {roles.map((role) => (
                  <td key={`${resource}-${role}`} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox" 
                        checked={matrix[`${resource}-${role}`] || false}
                        onChange={() => onToggle(resource, role)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer" 
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTab({ users, roles, onChangeRole, onRemove }: { users: User[], roles: Role[], onChangeRole: (uid: string, role: string) => void, onRemove: (uid: string) => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-white/[0.02]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Usuário</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Email</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Papel Atual</th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt="" className="h-8 w-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select 
                  value={user.role}
                  onChange={(e) => onChangeRole(user.id, e.target.value)}
                  className="rounded-lg border border-gray-300 bg-transparent px-3 py-1.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button 
                  onClick={() => onRemove(user.id)}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
