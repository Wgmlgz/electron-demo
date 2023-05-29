export const MIN_SCALE = 0.1;

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

export interface LambdaStats {
  lambda_inactivity: number;
  max_lambda_inactivity: number;
  queuing_time: number;
  max_queuing_time: number;
  shard: string;
}
