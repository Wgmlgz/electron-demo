export interface Device {
  date: string;
  device_id: string;
  engine_id: string;
  current_session_id: string;
  shard_id: string;
  actions: string;
  lambda_ts: number; 
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