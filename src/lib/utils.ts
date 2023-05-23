type ActionStatus = '+' | '-';
type Action = `${string}${ActionStatus}`;
export interface Device {
  date: Date;
  deviceId: string;
  engineId: string;
  currentSessionId: string;
  shardId: string;
  actions: Action[];
}

export const MIN_SCALE = 0.1;
