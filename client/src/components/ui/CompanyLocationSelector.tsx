// client/src/components/ui/CompanyLocationSelector.tsx

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin } from "lucide-react";
import { useAppSettings } from "@/components/AppContext";

interface CompanyLocationSelectorProps {
  selectedEmpresa?: string;
  selectedSede?: string;
  onEmpresaChange: (empresaId: string, empresaName: string) => void;
  onSedeChange: (sedeId: string, sedeName: string) => void;
  disabled?: boolean;
  required?: boolean;
  showLabels?: boolean;
}

const CompanyLocationSelector: React.FC<CompanyLocationSelectorProps> = ({
  selectedEmpresa = '',
  selectedSede = '',
  onEmpresaChange,
  onSedeChange,
  disabled = false,
  required = false,
  showLabels = true
}) => {
  const { getAllEmpresas, getSedesByEmpresa } = useAppSettings();
  const [currentEmpresa, setCurrentEmpresa] = useState(selectedEmpresa);
  const [currentSede, setCurrentSede] = useState(selectedSede);

  const empresas = getAllEmpresas();
  const sedesDisponibles = currentEmpresa ? getSedesByEmpresa(currentEmpresa) : [];

  // Efectos para sincronizar con props
  useEffect(() => {
    setCurrentEmpresa(selectedEmpresa);
  }, [selectedEmpresa]);

  useEffect(() => {
    setCurrentSede(selectedSede);
  }, [selectedSede]);

  // Manejar cambio de empresa
  const handleEmpresaChange = (empresaId: string) => {
    const empresa = empresas.find(e => e.id === empresaId);
    if (empresa) {
      setCurrentEmpresa(empresaId);
      setCurrentSede(''); // Limpiar sede cuando cambia empresa
      onEmpresaChange(empresaId, empresa.name);
      onSedeChange('', ''); // Notificar que sede se limpió
    }
  };

  // Manejar cambio de sede
  const handleSedeChange = (sedeId: string) => {
    const sede = sedesDisponibles.find(s => s.id === sedeId);
    if (sede) {
      setCurrentSede(sedeId);
      onSedeChange(sedeId, sede.name);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de Empresa */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="empresa-selector" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Empresa {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Select
          value={currentEmpresa}
          onValueChange={handleEmpresaChange}
          disabled={disabled}
          required={required}
        >
          <SelectTrigger id="empresa-selector">
            <SelectValue placeholder="Selecciona una empresa" />
          </SelectTrigger>
          <SelectContent>
            {empresas.length === 0 ? (
              <SelectItem value="_no_empresas" disabled>
                No hay empresas configuradas
              </SelectItem>
            ) : (
              empresas.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {empresa.name}
                    <span className="text-muted-foreground text-sm">
                      ({empresa.sedes.length} sedes)
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Selector de Sede */}
      <div className="space-y-2">
        {showLabels && (
          <Label htmlFor="sede-selector" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Sede {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Select
          value={currentSede}
          onValueChange={handleSedeChange}
          disabled={disabled || !currentEmpresa}
          required={required}
        >
          <SelectTrigger id="sede-selector">
            <SelectValue placeholder={
              !currentEmpresa 
                ? "Primero selecciona una empresa" 
                : "Selecciona una sede"
            } />
          </SelectTrigger>
          <SelectContent>
            {!currentEmpresa ? (
              <SelectItem value="_no_empresa" disabled>
                Selecciona una empresa primero
              </SelectItem>
            ) : sedesDisponibles.length === 0 ? (
              <SelectItem value="_no_sedes" disabled>
                No hay sedes configuradas para esta empresa
              </SelectItem>
            ) : (
              sedesDisponibles.map((sede) => (
                <SelectItem key={sede.id} value={sede.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {sede.name}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Información adicional */}
      {currentEmpresa && currentSede && (
        <div className="text-sm text-muted-foreground bg-blue-50 p-2 rounded border">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <strong>Empresa:</strong> {empresas.find(e => e.id === currentEmpresa)?.name}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            <strong>Sede:</strong> {sedesDisponibles.find(s => s.id === currentSede)?.name}
          </div>
        </div>
      )}

      {/* Mensaje de ayuda cuando no hay empresas configuradas */}
      {empresas.length === 0 && (
        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>
              No hay empresas configuradas. Ve a <strong>Configuración → Empresas y Sedes</strong> para agregar empresas.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyLocationSelector;