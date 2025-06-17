// client/src/components/users/UserList.tsx - CORRECCIÓN DE MUTATIONS

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient"; // ← CORRECCIÓN: Import correcto
import CompanyLocationSelector from "@/components/ui/CompanyLocationSelector";
import { useAppSettings } from "@/components/AppContext";
import { Building2, MapPin, Search, Edit, Trash2 } from "lucide-react";

// Interfaces necesarias
interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  apiKey: string;
  isAdmin: boolean;
  location?: string;
  floor?: string;
}

interface UserEditForm extends Partial<User> {
  password?: string;
  regenerateApiKey?: boolean;
  locationName?: string;
  floorName?: string;
}

// Función auxiliar para encontrar nombres por IDs
const useLocationNames = () => {
  const { getAllEmpresas } = useAppSettings();

  const getLocationNames = (locationId: string, floorId: string) => {
    const empresas = getAllEmpresas();
    const empresa = empresas.find(e => e.id === locationId);
    const sede = empresa?.sedes.find(s => s.id === floorId);

    return {
      empresaName: empresa?.name || '',
      sedeName: sede?.name || ''
    };
  };

  return { getLocationNames };
};

// Componente para mostrar empresa y sede
const UserLocationDisplay: React.FC<{ user: User }> = ({ user }) => {
  const { getAllEmpresas } = useAppSettings();

  const getLocationDisplay = () => {
    if (!user.location && !user.floor) {
      return (
        <div className="text-gray-500 italic">
          Sin asignar
        </div>
      );
    }

    const empresas = getAllEmpresas();
    const empresa = empresas.find(e => e.id === user.location);
    const sede = empresa?.sedes.find(s => s.id === user.floor);

    if (empresa && sede) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Building2 className="h-3 w-3 text-blue-600" />
            <span className="font-medium">{empresa.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3 text-green-600" />
            <span>{sede.name}</span>
          </div>
        </div>
      );
    }

    // Fallback para datos antiguos
    return (
      <div className="space-y-1">
        <div className="text-sm text-amber-600">
          {user.location || 'Sin empresa'}
        </div>
        <div className="text-xs text-gray-500">
          {user.floor || 'Sin sede'}
        </div>
        <div className="text-xs text-amber-500 italic">
          (Datos antiguos)
        </div>
      </div>
    );
  };

  return getLocationDisplay();
};

const UserList: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState<UserEditForm>({});

  // Estados para el selector de empresa y sede en edición
  const [editSelectedEmpresa, setEditSelectedEmpresa] = useState('');
  const [editSelectedSede, setEditSelectedSede] = useState('');

  const { getLocationNames } = useLocationNames();

  // Query para obtener usuarios
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest({ url: '/api/users' }),
    staleTime: 5000,
    refetchInterval: 10000,
  });

  // ✅ CORRECCIÓN: Agregar updateMutation que faltaba
  const updateMutation = useMutation({
    mutationFn: async (data: {id: number, userData: Partial<User>}) => {
      await apiRequest({
        method: "PUT",
        url: `/api/users/${data.id}`,
        body: data.userData
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setShowEditDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al actualizar usuario: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // ✅ CORRECCIÓN: Agregar deleteMutation que también puede faltar
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest({
        method: "DELETE",
        url: `/api/users/${id}`
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setConfirmDelete(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al eliminar usuario: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Asegurar que users sea siempre un array
  const usersArray = Array.isArray(users) ? users : [];

  const filteredUsers = usersArray.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para abrir el diálogo de edición
  const openEditDialog = (user: User) => {
    setSelectedUser(user);

    // Obtener nombres actuales
    const { empresaName, sedeName } = getLocationNames(user.location || '', user.floor || '');

    setEditFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      location: user.location || '',
      floor: user.floor || '',
      locationName: empresaName,
      floorName: sedeName,
    });

    // Configurar selecciones del selector
    setEditSelectedEmpresa(user.location || '');
    setEditSelectedSede(user.floor || '');

    setShowEditDialog(true);
  };

  // Manejar cambio de empresa en edición
  const handleEditEmpresaChange = (empresaId: string, empresaName: string) => {
    setEditSelectedEmpresa(empresaId);
    setEditFormData(prev => ({
      ...prev,
      location: empresaId,
      locationName: empresaName,
      floor: '', // Limpiar sede
      floorName: ''
    }));
    // Limpiar sede cuando cambia empresa
    setEditSelectedSede('');
  };

  // Manejar cambio de sede en edición
  const handleEditSedeChange = (sedeId: string, sedeName: string) => {
    setEditSelectedSede(sedeId);
    setEditFormData(prev => ({
      ...prev,
      floor: sedeId,
      floorName: sedeName
    }));
  };

  // Función para cerrar el diálogo de edición
  const closeEditDialog = () => {
    setShowEditDialog(false);
    setSelectedUser(null);
    setEditFormData({});
    setEditSelectedEmpresa('');
    setEditSelectedSede('');
  };

  if (isLoading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div>Error al cargar usuarios: {error.message}</div>;
  }

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="mt-4 mb-6 flex">
        <div className="flex-1 min-w-0">
          <label htmlFor="search-users" className="sr-only">
            Buscar
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              id="search-users"
              className="pl-10"
              placeholder="Buscar usuarios"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                API Key
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No se encontraron usuarios.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserLocationDisplay user={user} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isAdmin ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 font-mono">
                      <span>{user.apiKey.substring(0, 8)}...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(user.apiKey);
                          toast({
                            title: "API Key copiada",
                            description: "La API Key ha sido copiada al portapapeles.",
                          });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-600 hover:text-primary-900 mr-2"
                      onClick={() => openEditDialog(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        setSelectedUser(user);
                        setConfirmDelete(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la cuenta de usuario "{selectedUser?.name}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={closeEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario seleccionado. Los cambios se guardarán inmediatamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input 
                id="edit-name" 
                value={editFormData.name || ''} 
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                placeholder="Nombre completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-username">Usuario</Label>
              <Input 
                id="edit-username" 
                value={editFormData.username || ''} 
                onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                placeholder="Nombre de usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={editFormData.email || ''} 
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                placeholder="correo@empresa.com"
              />
            </div>

            {/* Selector de Empresa y Sede */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Asignación de Ubicación</Label>
              <CompanyLocationSelector
                selectedEmpresa={editSelectedEmpresa}
                selectedSede={editSelectedSede}
                onEmpresaChange={handleEditEmpresaChange}
                onSedeChange={handleEditSedeChange}
                required={true}
                showLabels={true}
              />

              {/* Mostrar selección actual si hay una */}
              {editFormData.locationName && editFormData.floorName && (
                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border">
                  <div><strong>Empresa:</strong> {editFormData.locationName}</div>
                  <div><strong>Sede:</strong> {editFormData.floorName}</div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Contraseña (dejar vacío para no cambiar)</Label>
              <Input 
                id="edit-password" 
                type="password" 
                value={editFormData.password || ''} 
                onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Input 
                type="checkbox" 
                id="edit-admin" 
                className="w-4 h-4" 
                checked={editFormData.isAdmin || false} 
                onChange={(e) => setEditFormData({...editFormData, isAdmin: e.target.checked})}
              />
              <Label htmlFor="edit-admin">Acceso de administrador</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Input 
                type="checkbox" 
                id="edit-regenerate-key" 
                className="w-4 h-4" 
                checked={editFormData.regenerateApiKey || false} 
                onChange={(e) => setEditFormData({...editFormData, regenerateApiKey: e.target.checked})}
              />
              <Label htmlFor="edit-regenerate-key">Regenerar API Key</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditDialog}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Validar que se haya seleccionado empresa y sede
                if (!editSelectedEmpresa || !editSelectedSede) {
                  toast({
                    title: "Selección incompleta",
                    description: "Debe seleccionar tanto la empresa como la sede",
                    variant: "destructive",
                  });
                  return;
                }

                if (selectedUser) {
                  updateMutation.mutate({
                    id: selectedUser.id, 
                    userData: editFormData
                  });
                }
              }}
              disabled={updateMutation.isPending || !editSelectedEmpresa || !editSelectedSede}
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserList;