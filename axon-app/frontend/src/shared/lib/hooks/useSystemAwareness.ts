"use client";

import { useSyncExternalStore } from "react";
import { API_BASE_URL } from "@/shared/lib/api-client/config";

type AwarenessState = {
  isSyncing: boolean;
  lastSyncTime: Date | null;
};

let state: AwarenessState = {
  isSyncing: false,
  lastSyncTime: null,
};

let listeners: Set<() => void> = new Set();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

let ws: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

const connect = () => {
  if (typeof window === 'undefined') return;
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
  }

  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  let wsHost = "localhost:8000"; 
  
  if (API_BASE_URL && API_BASE_URL.startsWith("http")) {
      try {
        const url = new URL(API_BASE_URL);
        wsHost = url.host;
      } catch (e) {}
  }
  
  const wsUrl = `${wsProtocol}//${wsHost}/system/ws/awareness`;
  console.log(`[System Awareness] Connecting: ${wsUrl}`);
  
  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`[System Awareness] Connected successfully to ${wsUrl}`);
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    ws.onmessage = (event) => {
      console.log("[System Awareness] Message received:", event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.event === "awareness_synchronized") {
          console.log("[System Awareness] SYNC TRIGGERED");
          state = { ...state, isSyncing: true, lastSyncTime: new Date() };
          emitChange();
          
          setTimeout(() => {
            state = { ...state, isSyncing: false };
            emitChange();
          }, 3000);
        }
      } catch (e) {}
    };

    ws.onclose = (event) => {
      if (!event.wasClean) {
          console.warn(`[System Awareness] Disconnected (${event.code}). Retrying...`);
          if (!reconnectTimer) {
            reconnectTimer = setTimeout(connect, 5000);
          }
      }
    };
    
    ws.onerror = () => {};
  } catch (e) {
    if (!reconnectTimer) {
        reconnectTimer = setTimeout(connect, 5000);
    }
  }
};

export const awarenessStore = {
  subscribe(listener: () => void) {
    if (listeners.size === 0) {
      connect();
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        if (ws) {
            ws.onclose = null; 
            ws.close();
            ws = null;
        }
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
      }
    };
  },
  getSnapshot() {
    return state;
  },
  getServerSnapshot() {
    return state;
  }
};

export const useSystemAwareness = () => {
  return useSyncExternalStore(
    awarenessStore.subscribe,
    awarenessStore.getSnapshot,
    awarenessStore.getServerSnapshot
  );
};
