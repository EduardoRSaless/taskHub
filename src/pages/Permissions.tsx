import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Modal } from "../components/ui/modal";
import ConfirmationModal from "../components/ui/modal/ConfirmationModal"; // Importar
import { useModal } from "../hooks/useModal";
import { PlusIcon, TrashBinIcon } from "../icons";
import Badge from "../components/ui/badge/Badge";
import { useData } from "../context/DataContext";
import { User } from "../context/AuthContext";

interface RoleDisplay {
  id?: string;
  name: string;
  description: string;
  color: string;
}

export type PermissionResource = "Projetos" | "Times" | "Calendário" | "Configurações" | "Usuários";
export type PermissionMatrix = Record<string, Record<PermissionResource, boolean>>;

export default function Permissions() {
  const { isOpen, openModal, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState("roles");
  const { users, updateUserRole, deleteUser } = useData();

  // Estados para Edição de Role
  const [selectedRole, setSelectedRole] = useState<RoleDisplay | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [roleColor, setRoleColor] = useState("light");

  // Estados para Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "role" | "user", id: string } | null>(null);

  // Roles
  const [rolesDisplay, setRolesDisplay] = useState<RoleDisplay[]>([
    { name: "Admin", description: "Acesso total ao sistema e configurações.", color: "success" },
    { name: "Manager", description: "Gerencia times, projetos e relatórios.", color: "warning" },
    { name: "Member", description: "Visualiza e edita suas próprias tarefas.", color: "light" },
  ]);

  // Matriz de Permissões
  const [matrix, setMatrix] = useState<PermissionMatrix>({
    "Admin": { "Projetos": true, "Times": true, "Calendário": true, "Configurações": true, "Usuários": true },
    "Manager": { "Projetos": true, "Times": true, "Calendário": true, "Configurações": false, "Usuários": false },
    "Member": { "Projetos": false, "Times": false, "Calendário": true, "Configurações": false, "Usuários": false },
  });

  useEffect(() => {
    const savedMatrix = localStorage.getItem("permission_matrix");
    if (savedMatrix) {
      setMatrix(JSON.parse(savedMatrix));
    }
  }, []);

  const saveMatrix = (newMatrix: PermissionMatrix) => {
    setMatrix(newMatrix);
    localStorage.setItem("permission_matrix", JSON.stringify(newMatrix));
    window.dispatchEvent(new Event("permissionsUpdated"));
  };

  // Calcular usersCount
  const rolesWithCounts = rolesDisplay.map(role => ({
    ...role,
    id: role.name,
    usersCount: users.filter(user => user.role === role.name).length
  }));

  // Handlers
  const handleEditRole = (role: RoleDisplay) => {
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

  const handleDeleteRoleClick = (roleName: string) => {
    if (roleName === "Admin") {
      alert("O papel Admin não pode ser excluído.");
      return;
    }
    setItemToDelete({ type: "role", id: roleName });
    setIsDeleteModalOpen(true);
  };

  const handleRemoveUserClick = (userId: string) => {
    setItemToDelete({ type: "user", id: userId });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "role") {
      setRolesDisplay(prev => prev.filter(r => r.name !== itemToDelete.id));
      const newMatrix = { ...matrix };
      delete newMatrix[itemToDelete.id];
      saveMatrix(newMatrix);
    } else if (itemToDelete.type === "user") {
      try {
        await deleteUser(itemToDelete.id);
      } catch (error) {
        console.error("Erro ao remover usuário:", error);
        alert("Erro ao remover usuário.");
      }
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleSaveRole = () => {
    if (!roleName) return;

    if (selectedRole) {
      setRolesDisplay(prev => prev.map(r => r.name === selectedRole.name ? { ...r, name: roleName, description: roleDesc, color: roleColor } : r));
    } else {
      const newRole: RoleDisplay = { name: roleName, description: roleDesc, color: roleColor };
      setRolesDisplay(prev => [...prev, newRole]);
      const newMatrix = { ...matrix, [roleName]: { "Projetos": false, "Times": false, "Calendário": false, "Configurações": false, "Usuários": false } };
      saveMatrix(newMatrix);
    }
    closeModal();
  };

  const handleTogglePermission = (resource: PermissionResource, role: string) => {
    const newMatrix = {
      ...matrix,
      [role]: {
        ...matrix[role],
        [resource]: !matrix[role]?.[resource]
      }
    };
    saveMatrix(newMatrix);
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
    } catch (error) {
      console.error("Erro ao mudar papel:", error);
      alert("Erro ao mudar papel.");
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
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex gap-6">
            <button onClick={() => setActiveTab("roles")} className={`pb-4 text-sm font-medium transition-colors ${activeTab === "roles" ? "border-b-2 border-brand-500 text-brand-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>Papéis (Roles)</button>
            <button onClick={() => setActiveTab("matrix")} className={`pb-4 text-sm font-medium transition-colors ${activeTab === "matrix" ? "border-b-2 border-brand-500 text-brand-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>Matriz de Permissões</button>
            <button onClick={() => setActiveTab("users")} className={`pb-4 text-sm font-medium transition-colors ${activeTab === "users" ? "border-b-2 border-brand-500 text-brand-500" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>Usuários</button>
          </nav>
        </div>

        {activeTab === "roles" && <RolesTab roles={rolesWithCounts} onEdit={handleEditRole} onDelete={handleDeleteRoleClick} onCreate={handleCreateRole} />}
        {activeTab === "matrix" && <PermissionMatrixTab roles={rolesDisplay.map(r => r.name)} matrix={matrix} onToggle={handleTogglePermission} />}
        {activeTab === "users" && <UsersTab users={users} roles={rolesDisplay} onChangeRole={handleChangeUserRole} onRemove={handleRemoveUserClick} />}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] p-6 bg-white dark:bg-gray-900">
        <div className="flex flex-col">
          <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">{selectedRole ? "Editar Papel" : "Novo Papel"}</h3>
          <div className="space-y-4 mt-4">
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Nome</label><input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Descrição</label><textarea rows={3} value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cor</label><select value={roleColor} onChange={(e) => setRoleColor(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"><option value="light">Cinza</option><option value="success">Verde</option><option value="warning">Amarelo</option><option value="error">Vermelho</option><option value="info">Azul</option></select></div>
          </div>
          <div className="mt-6 flex gap-3"><button onClick={closeModal} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Cancelar</button><button onClick={handleSaveRole} className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">Salvar</button></div>
        </div>
      </Modal>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={itemToDelete?.type === "role" ? "Excluir Papel" : "Remover Usuário"}
        message={itemToDelete?.type === "role" ? "Tem certeza que deseja excluir este papel? Isso pode afetar usuários existentes." : "Tem certeza que deseja remover este usuário do sistema?"}
        confirmText="Excluir"
      />
    </>
  );
}

function RolesTab({ roles, onEdit, onDelete, onCreate }: { roles: any[], onEdit: any, onDelete: any, onCreate: any }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => (
        <div key={role.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] relative group">
          <div className="flex items-center justify-between mb-4"><Badge color={role.color}>{role.name}</Badge><span className="text-xs text-gray-500">{role.usersCount} Usuários</span></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10 line-clamp-2">{role.description}</p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => onEdit(role)} className="text-sm font-medium text-brand-500 hover:text-brand-600">Editar Permissões</button>
            {role.name !== "Admin" && (
              <button onClick={() => onDelete(role.name)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                <TrashBinIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
      <button onClick={onCreate} className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 hover:border-brand-500 hover:bg-brand-50/50 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-brand-500/30"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-3 dark:bg-gray-800"><PlusIcon className="h-6 w-6 text-brand-500" /></div><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Criar Novo Papel</span></button>
    </div>
  );
}

function PermissionMatrixTab({ roles, matrix, onToggle }: { roles: string[], matrix: PermissionMatrix, onToggle: (res: PermissionResource, role: string) => void }) {
  const resources: PermissionResource[] = ["Projetos", "Times", "Calendário", "Configurações", "Usuários"];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-white/[0.02]">
            <tr><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Recurso</th>{roles.map((role) => (<th key={role} className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{role}</th>))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {resources.map((resource) => (
              <tr key={resource}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white/90">{resource}</td>
                {roles.map((role) => (
                  <td key={`${resource}-${role}`} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <input type="checkbox" checked={matrix[role]?.[resource] || false} onChange={() => onToggle(resource, role)} className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer" />
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

function UsersTab({ users, roles, onChangeRole, onRemove }: { users: User[], roles: RoleDisplay[], onChangeRole: any, onRemove: any }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-white/[0.02]">
          <tr><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Usuário</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Email</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Papel Atual</th><th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Ação</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><img src={user.avatar} alt="" className="h-8 w-8 rounded-full" /><span className="text-sm font-medium text-gray-800 dark:text-white/90">{user.name}</span></div></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap"><select value={user.role} onChange={(e) => onChangeRole(user.id, e.target.value)} className="rounded-lg border border-gray-300 bg-transparent px-3 py-1.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90">{roles.map(r => (<option key={r.name} value={r.name}>{r.name}</option>))}</select></td>
              <td className="px-6 py-4 whitespace-nowrap text-right"><button onClick={() => onRemove(user.id)} className="text-sm font-medium text-red-500 hover:text-red-600">Remover</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
