export interface Device {
  date: string;
  deviceId: string;
  engineId: string;
  currentSessionId: string;
  shardId: string;
  actions: string;
}

export interface LambdaStats {
  lambda_inactivity: number;
  max_lambda_inactivity: number;
  queuing_time: number;
  max_queuing_time: number;
  shard: string;
}

export interface DeviceData {
  devices: Device[];
  problematic?: Device[];
  lambda_stats: Record<string, LambdaStats>;
}