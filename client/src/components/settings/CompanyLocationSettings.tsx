// client/src/components/settings/CompanyLocationSettings.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle
} from "lucide-react";
import { useAppSettings, Empresa, Sede } from "@/components/AppContext";

interface EmpresaFormData {
  name: string;
}

interface SedeFormData {
  name: string;
}

const CompanyLocationSettings: React.FC = () => {
  const {
    settings,
    addEmpresa,
    updateEmpresa,
    removeEmpresa,
    addSede,
    updateSede,
    removeSede,
    getAllEmpresas
  } = useAppSettings();

  // Estados para diálogos
  const [showEmpresaDialog, setShowEmpresaDialog] = useState(false);
  const [showSedeDialog, setShowSedeDialog] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [editingSede, setEditingSede] = useState<{ empresa: Empresa; sede: Sede } | null>(null);
  const [selectedEmpresaForSede, setSelectedEmpresaForSede] = useState<string>('');

  // Formularios
  const empresaForm = useForm<EmpresaFormData>();
  const sedeForm = useForm<SedeFormData>();

  // Obtener todas las empresas
  const empresas = getAllEmpresas();

  // Handlers para empresas
  const handleAddEmpresa = (data: EmpresaFormData) => {
    addEmpresa({
      name: data.name,
      sedes: []
    });
    empresaForm.reset();
    setShowEmpresaDialog(false);
  };

  const handleEditEmpresa = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    empresaForm.setValue('name', empresa.name);
    setShowEmpresaDialog(true);
  };

  const handleUpdateEmpresa = (data: EmpresaFormData) => {
    if (editingEmpresa) {
      updateEmpresa(editingEmpresa.id, { name: data.name });
      empresaForm.reset();
      setShowEmpresaDialog(false);
      setEditingEmpresa(null);
    }
  };

  const handleRemoveEmpresa = (empresaId: string) => {
    removeEmpresa(empresaId);
  };

  // Handlers para sedes
  const handleAddSede = (data: SedeFormData) => {
    if (selectedEmpresaForSede) {
      addSede(selectedEmpresaForSede, {
        name: data.name
      });
      sedeForm.reset();
      setShowSedeDialog(false);
      setSelectedEmpresaForSede('');
    }
  };

  const handleEditSede = (empresa: Empresa, sede: Sede) => {
    setEditingSede({ empresa, sede });
    sedeForm.setValue('name', sede.name);
    setShowSedeDialog(true);
  };

  const handleUpdateSede = (data: SedeFormData) => {
    if (editingSede) {
      updateSede(editingSede.empresa.id, editingSede.sede.id, { name: data.name });
      sedeForm.reset();
      setShowSedeDialog(false);
      setEditingSede(null);
    }
  };

  const handleRemoveSede = (empresaId: string, sedeId: string) => {
    removeSede(empresaId, sedeId);
  };

  // Resetear diálogos
  const resetEmpresaDialog = () => {
    setShowEmpresaDialog(false);
    setEditingEmpresa(null);
    empresaForm.reset();
  };

  const resetSedeDialog = () => {
    setShowSedeDialog(false);
    setEditingSede(null);
    setSelectedEmpresaForSede('');
    sedeForm.reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestión de Empresas y Sedes
          </CardTitle>
          <CardDescription>
            Configure las empresas y sus respectivas sedes para ser utilizadas en la asignación de usuarios e impresoras.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empresas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sedes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {empresas.reduce((total, empresa) => total + empresa.sedes.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <Button onClick={() => setShowEmpresaDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Empresa
        </Button>

        <Button variant="outline" onClick={() => setShowSedeDialog(true)}>
          <MapPin className="h-4 w-4 mr-2" />
          Nueva Sede
        </Button>
      </div>

      {/* Diálogo para Empresa */}
      <Dialog open={showEmpresaDialog} onOpenChange={resetEmpresaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEmpresa ? 'Editar Empresa' : 'Agregar Nueva Empresa'}
            </DialogTitle>
            <DialogDescription>
              {editingEmpresa 
                ? 'Modifica los datos de la empresa seleccionada.'
                : 'Ingresa los datos para crear una nueva empresa.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={empresaForm.handleSubmit(editingEmpresa ? handleUpdateEmpresa : handleAddEmpresa)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="empresa-name">Nombre de la Empresa</Label>
                <Input
                  id="empresa-name"
                  placeholder="Ej: Sede Principal, Sucursal Norte"
                  {...empresaForm.register('name', { required: 'El nombre es requerido' })}
                />
                {empresaForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {empresaForm.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={resetEmpresaDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingEmpresa ? 'Actualizar' : 'Agregar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Sede */}
      <Dialog open={showSedeDialog} onOpenChange={resetSedeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSede ? 'Editar Sede' : 'Agregar Nueva Sede'}
            </DialogTitle>
            <DialogDescription>
              {editingSede 
                ? 'Modifica los datos de la sede seleccionada.'
                : 'Selecciona una empresa e ingresa los datos para crear una nueva sede.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={sedeForm.handleSubmit(editingSede ? handleUpdateSede : handleAddSede)}>
            <div className="space-y-4">
              {!editingSede && (
                <div className="space-y-2">
                  <Label htmlFor="empresa-select">Empresa</Label>
                  <select
                    id="empresa-select"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedEmpresaForSede}
                    onChange={(e) => setSelectedEmpresaForSede(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="sede-name">Nombre de la Sede</Label>
                <Input
                  id="sede-name"
                  placeholder="Ej: Piso 1 - Administración, Área Comercial"
                  {...sedeForm.register('name', { required: 'El nombre es requerido' })}
                />
                {sedeForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {sedeForm.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={resetSedeDialog}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!editingSede && !selectedEmpresaForSede}
              >
                {editingSede ? 'Actualizar' : 'Agregar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lista de empresas y sedes */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas y Sedes Configuradas</CardTitle>
          <CardDescription>
            Gestiona las empresas existentes y sus sedes asociadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {empresas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay empresas configuradas</p>
              <p className="text-sm">Agrega tu primera empresa para comenzar</p>
            </div>
          ) : (
            <div className="space-y-6">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="border rounded-lg p-4">
                  {/* Header de empresa */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{empresa.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        ({empresa.sedes.length} sedes)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEmpresa(empresa)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar empresa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará la empresa "{empresa.name}" y todas sus sedes asociadas. 
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveEmpresa(empresa.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Sedes de la empresa */}
                  {empresa.sedes.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground border-2 border-dashed rounded">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay sedes configuradas para esta empresa</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sede</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {empresa.sedes.map((sede) => (
                          <TableRow key={sede.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-green-600" />
                                {sede.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditSede(empresa, sede)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar sede?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción eliminará la sede "{sede.name}" de la empresa "{empresa.name}". 
                                        Esta acción no se puede deshacer.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRemoveSede(empresa.id, sede.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyLocationSettings;