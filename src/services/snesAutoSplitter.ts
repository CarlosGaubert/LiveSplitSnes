import { AutosplitterConfig } from '../types/settings';

export type EmulatorStatus = 'connected' | 'connecting' | 'disconnected' | 'simulated';

export interface SnesMemoryUpdate {
  address: number;
  value: number;
  previousValue: number;
}

export type AutoSplitterEvent = 
  | { type: 'start' }
  | { type: 'split'; splitIndex?: number; splitName?: string }
  | { type: 'reset' }
  | { type: 'status'; status: EmulatorStatus; message: string };

type Listener = (event: AutoSplitterEvent) => void;

class SnesAutoSplitterService {
  private socket: WebSocket | null = null;
  private status: EmulatorStatus = 'disconnected';
  private listeners: Set<Listener> = new Set();
  private pollTimer: any = null;
  private config: AutosplitterConfig = {
    enabled: true,
    emulatorType: 'qusb2snes',
    serverUrl: 'ws://localhost:8080',
    autoStart: true,
    autoReset: true,
    pollIntervalMs: 50,
  };

  public init(config: AutosplitterConfig) {
    this.config = config;
    if (config.enabled) {
      this.connect();
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(event: AutoSplitterEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  public getStatus(): EmulatorStatus {
    return this.status;
  }

  public connect() {
    if (this.socket) {
      this.disconnect();
    }

    if (this.config.emulatorType === 'mock') {
      this.status = 'simulated';
      this.notify({ type: 'status', status: 'simulated', message: 'Simulador Virtual de SNES Activo' });
      return;
    }

    this.status = 'connecting';
    this.notify({ type: 'status', status: 'connecting', message: `Conectando a ${this.config.serverUrl}...` });

    try {
      this.socket = new WebSocket(this.config.serverUrl);

      this.socket.onopen = () => {
        this.status = 'connected';
        this.notify({ type: 'status', status: 'connected', message: 'Conectado al emulador de SNES' });
        this.requestDeviceList();
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onerror = () => {
        // Fallback or alert
        this.status = 'disconnected';
        this.notify({ 
          type: 'status', 
          status: 'disconnected', 
          message: 'No se pudo conectar al puerto de emulador (se puede activar modo simulado)' 
        });
      };

      this.socket.onclose = () => {
        this.status = 'disconnected';
        this.notify({ type: 'status', status: 'disconnected', message: 'Desconectado del emulador' });
      };
    } catch {
      this.status = 'disconnected';
      this.notify({ type: 'status', status: 'disconnected', message: 'Error iniciando conexión' });
    }
  }

  public disconnect() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.status = 'disconnected';
    this.notify({ type: 'status', status: 'disconnected', message: 'Desconectado' });
  }

  public setSimulatedMode(enable: boolean) {
    if (enable) {
      this.disconnect();
      this.status = 'simulated';
      this.notify({ type: 'status', status: 'simulated', message: 'Simulador Virtual de SNES Activo' });
    } else {
      this.disconnect();
    }
  }

  // QUsb2snes protocol helper
  private requestDeviceList() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload = {
        Opcode: 'DeviceList',
        Space: 'SNES',
      };
      this.socket.send(JSON.stringify(payload));
    }
  }

  private handleMessage(raw: string) {
    try {
      const data = JSON.parse(raw);
      // Process responses from QUsb2snes / RetroArch websocket
      if (data.Results) {
        // If device list returned, attach to first device
        const attachPayload = {
          Opcode: 'Attach',
          Space: 'SNES',
          Operands: [data.Results[0]],
        };
        this.socket?.send(JSON.stringify(attachPayload));
      }
    } catch {
      // Non-JSON or binary RAM stream
    }
  }

  // --- Methods to trigger simulated SNES RAM events for testing ---
  public triggerSimulatedStart() {
    this.notify({ type: 'start' });
  }

  public triggerSimulatedSplit(splitName?: string) {
    this.notify({ type: 'split', splitName });
  }

  public triggerSimulatedReset() {
    this.notify({ type: 'reset' });
  }

  public async triggerSavestate(slot: number, action: 'load' | 'save'): Promise<void> {
    try {
      // Check if Tauri is available in window
      if (window && (window as any).__TAURI_INTERNALS__) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('send_emulator_action', {
          payload: {
            action: action === 'load' ? 'load_state' : 'save_state',
            slot,
          },
        });
      } else {
        console.log(`[Savestate Mock] ${action.toUpperCase()}_STATE Slot: ${slot}`);
      }
    } catch (err) {
      console.warn('Tauri invoke not available or failed, falling back to mock:', err);
    }
  }
}

export const snesAutoSplitter = new SnesAutoSplitterService();
