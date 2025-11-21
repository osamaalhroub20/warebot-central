import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

interface TelemetryData {
  robot: string;
  cpu: number;
  ram: number;
  battery: number;
  temperature: number;
  x: number;
  y: number;
  status: string;
}

interface TaskStatusData {
  task_id: string;
  status: string;
}

interface MapUpdateData {
  [key: string]: any;
}

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [taskStatusData, setTaskStatusData] = useState<TaskStatusData | null>(null);
  const [mapData, setMapData] = useState<MapUpdateData | null>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('telemetry', (data: TelemetryData) => {
      setTelemetryData(data);
    });

    socket.on('task_status', (data: TaskStatusData) => {
      setTaskStatusData(data);
    });

    socket.on('map_update', (data: MapUpdateData) => {
      setMapData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('telemetry');
      socket.off('task_status');
      socket.off('map_update');
    };
  }, []);

  return {
    isConnected,
    telemetryData,
    taskStatusData,
    mapData,
  };
};
