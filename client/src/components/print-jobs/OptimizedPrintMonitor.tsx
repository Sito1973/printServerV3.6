// client/src/components/print-jobs/OptimizedPrintMonitor.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { printPdfFromUrl, isQzTrayConnected } from '@/lib/qz-tray';
import { useToast } from '@/hooks/use-toast';

interface PrintJob {
  id: number;
  documentName: string;
  documentUrl: string;
  printerName: string;
  printerUniqueId: string;
  status: string;
  copies: number;
  duplex: boolean;
  orientation: string;
  qzTrayData?: any;
}

export const OptimizedPrintMonitor: React.FC = () => {
  const socket = useSocket();
  const { toast } = useToast();
  const [processingJobs, setProcessingJobs] = useState<Set<number>>(new Set());
  const [stats, setStats] = useState({
    processed: 0,
    failed: 0,
    avgTime: 0
  });

  // Procesar trabajo inmediatamente
  const processJobImmediately = async (job: PrintJob) => {
    const startTime = Date.now();

    if (processingJobs.has(job.id)) {
      console.log(`⏭️ Trabajo ${job.id} ya está siendo procesado`);
      return;
    }

    setProcessingJobs(prev => new Set(prev).add(job.id));
    console.log(`🚀 [OPTIMIZED] Procesando trabajo ${job.id} inmediatamente`);

    try {
      // Verificar QZ Tray
      if (!isQzTrayConnected()) {
        throw new Error("QZ Tray no está conectado");
      }

      // Actualizar estado en servidor
      await fetch(`/api/print-jobs/${job.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
        },
        body: JSON.stringify({ status: 'processing' })
      });

      // Usar datos QZ preconfigurados si están disponibles
      if (job.qzTrayData) {
        console.log(`📋 Usando datos QZ preconfigurados para impresión directa`);
        const qz = (window as any).qz;

        // Configurar impresora
        await qz.configs.setDefaults({
          printer: job.printerName
        });

        // Imprimir directamente con datos preconfigurados
        await qz.print(job.qzTrayData.config, job.qzTrayData.data);
      } else {
        // Fallback: imprimir desde URL
        console.log(`🔗 Imprimiendo directamente desde URL: ${job.documentUrl}`);
        await printPdfFromUrl(
          job.printerName,
          job.documentUrl,
          {
            copies: job.copies,
            duplex: job.duplex,
            orientation: job.orientation as 'portrait' | 'landscape'
          }
        );
      }

      // Marcar como completado
      await fetch(`/api/print-jobs/${job.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
        },
        body: JSON.stringify({ status: 'completed' })
      });

      const processTime = Date.now() - startTime;
      console.log(`✅ Trabajo ${job.id} completado en ${processTime}ms`);

      // Actualizar estadísticas
      setStats(prev => ({
        processed: prev.processed + 1,
        failed: prev.failed,
        avgTime: prev.avgTime 
          ? (prev.avgTime * prev.processed + processTime) / (prev.processed + 1)
          : processTime
      }));

      toast({
        title: "Impresión exitosa",
        description: `${job.documentName} enviado a ${job.printerName}`,
      });

    } catch (error) {
      console.error(`❌ Error procesando trabajo ${job.id}:`, error);

      await fetch(`/api/print-jobs/${job.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
        },
        body: JSON.stringify({ 
          status: 'failed',
          error: error.message 
        })
      });

      setStats(prev => ({
        ...prev,
        failed: prev.failed + 1
      }));

      toast({
        variant: "destructive",
        title: "Error de impresión",
        description: error.message,
      });
    } finally {
      setProcessingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    }
  };

  // Escuchar eventos WebSocket para procesamiento inmediato
  useEffect(() => {
    if (!socket) return;

    const handleNewJob = (job: PrintJob) => {
      console.log(`📡 [WEBSOCKET] Nuevo trabajo recibido:`, job);
      if (job.status === 'ready_for_client') {
        processJobImmediately(job);
      }
    };

    socket.on('new-print-job', handleNewJob);

    return () => {
      socket.off('new-print-job', handleNewJob);
    };
  }, [socket, processingJobs]);

  // Polling de respaldo (menos frecuente - cada 10 segundos)
  useEffect(() => {
    if (!isQzTrayConnected()) return;

    const checkPendingJobs = async () => {
      try {
        const response = await fetch('/api/print-jobs/pending', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
          }
        });

        if (response.ok) {
          const jobs = await response.json();
          for (const job of jobs) {
            if (job.status === 'ready_for_client' && !processingJobs.has(job.id)) {
              console.log(`📋 [POLLING] Trabajo pendiente encontrado: ${job.id}`);
              processJobImmediately(job);
            }
          }
        }
      } catch (error) {
        console.error('Error en polling de respaldo:', error);
      }
    };

    // Polling menos frecuente como respaldo
    const interval = setInterval(checkPendingJobs, 500);

    // Check inicial
    checkPendingJobs();

    return () => clearInterval(interval);
  }, [processingJobs]);

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Monitor de Impresión Optimizado</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Procesados:</span>
          <span className="ml-2 font-bold text-green-600">{stats.processed}</span>
        </div>
        <div>
          <span className="text-gray-600">Fallidos:</span>
          <span className="ml-2 font-bold text-red-600">{stats.failed}</span>
        </div>
        <div>
          <span className="text-gray-600">Tiempo promedio:</span>
          <span className="ml-2 font-bold">{Math.round(stats.avgTime)}ms</span>
        </div>
      </div>
      {processingJobs.size > 0 && (
        <div className="mt-2 text-sm text-blue-600">
          Procesando {processingJobs.size} trabajo(s)...
        </div>
      )}
    </div>
  );
};