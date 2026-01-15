import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { PermissionResource, PermissionMatrix } from "../pages/Permissions";

export function usePermission() {
  const { user } = useAuth();
  const [matrix, setMatrix] = useState<PermissionMatrix>({});

  useEffect(() => {
    const loadMatrix = () => {
      const savedMatrix = localStorage.getItem("permission_matrix");
      if (savedMatrix) {
        setMatrix(JSON.parse(savedMatrix));
      } else {
        // Matriz padrão se não houver nada salvo
        setMatrix({
          "Admin": { "Projetos": true, "Times": true, "Calendário": true, "Configurações": true, "Usuários": true },
          "Manager": { "Projetos": true, "Times": true, "Calendário": true, "Configurações": false, "Usuários": false },
          "Member": { "Projetos": false, "Times": false, "Calendário": true, "Configurações": false, "Usuários": false },
        });
      }
    };

    loadMatrix();
    window.addEventListener("permissionsUpdated", loadMatrix);
    return () => window.removeEventListener("permissionsUpdated", loadMatrix);
  }, []);

  const can = (resource: PermissionResource, action: "view" | "edit" = "view") => {
    if (!user) return false;
    if (user.role === "Admin") return true; // Admin sempre pode tudo

    const rolePermissions = matrix[user.role];
    if (!rolePermissions) return false;

    // Se a permissão para o recurso for true, permite tudo (simplificação)
    // Se for false, permite apenas visualização (se a lógica for essa)
    // Mas aqui vamos assumir: true = pode editar/criar/excluir, false = apenas ver (ou nem ver, dependendo da implementação na tela)
    
    const hasAccess = rolePermissions[resource];

    if (action === "view") return true; // Todos podem ver (modo leitura), ou mude para 'return hasAccess' se quiser esconder a tela
    if (action === "edit") return hasAccess;

    return false;
  };

  return { can };
}
