import { DeviceData, LambdaStats } from './../shared.d';
import { type Handler } from 'aws-lambda';
import { Schema, model } from 'dynamoose';
import * as _ from 'lodash';
import * as moment from 'moment';

const schema = new Schema({
  deviceID: {
    type: String,
    hashKey: true
  },
  engineID: {
    type: String
  },
  history_string: {
    type: String
  },
  kinesis_record_ts: {
    type: Number
  },
  lambda_ts: {
    type: Number
  },
  sessionID: {
    type: String
  },
  shardID: {
    type: Number
  }
});

const DeviceSplitstat = model('device_splitstat', schema);

export const handler: Handler = async (event) => {
  const raw = await DeviceSplitstat.scan()
  // .limit(500)
  .exec();

  const devices: DeviceData['devices'] = raw.map((item) => {
    return {
      current_session_id: item.sessionID,
      actions: item.history_string,
      device_id: item.deviceID,
      engine_id: item.engineID,
      shard_id: item.shardID,
      lambda_ts: item.lambda_ts,
      date: new Date(item.kinesis_record_ts * 1000).toISOString()
    };
  });

  const grouped = _.groupBy(raw, 'shardID');
  const lambda_stats: DeviceData['lambda_stats'] = Object.fromEntries(
    Object.entries(grouped).map(([shardID, arr]) => {
      const res: LambdaStats = {
        lambda_inactivity: moment().unix() - _.max(_.map(arr, 'lambda_ts')),
        max_lambda_inactivity: 1,
        queuing_time: moment().unix() - _.max(_.map(arr, 'kinesis_record_ts')),
        max_queuing_time: 1,
        shard: shardID
      };
      return [shardID, res];
    })
  );
  const res: DeviceData = {
    devices,
    lambda_stats
  };

  return {
    statusCode: 200,
    body: JSON.stringify(res)
  };
};
