import { DeviceData, LambdaStats } from './../shared.d';
import { type Handler } from 'aws-lambda';
import { Schema, model } from 'dynamoose';
import * as dynamoose from 'dynamoose';
import * as _ from 'lodash';
import * as moment from 'moment';

const schema = new Schema({
  deviceID: {
    type: String,
    hashKey: true
  },
  engineID: {
    type: dynamoose.type.ANY
  },
  history_string: {
    type: String
  },
  kinesis_record_ts: {
    type: Number
  },
  lambda_ts: {
    type: dynamoose.type.ANY
  },
  sessionID: {
    type: String
  },
  shardID: {
    type: dynamoose.type.ANY
  }
});

const DeviceSplitstat = model('device_splitstat', schema);

export const handler: Handler = async (event) => {
  const db_raw = await DeviceSplitstat.scan()
    // .limit(100)
    .exec();

  const raw = db_raw.map((x) => {
    if (x.deviceID == 'unknown') console.log(x);
    let { lambda_ts, kinesis_record_ts, deviceID, engineID, shardID } = x;

    x.deviceID = String(deviceID);
    x.engineID = String(engineID);
    x.shardID = String(shardID);

    if (typeof lambda_ts === 'string') lambda_ts = new Date(lambda_ts || 0).getSeconds();
    lambda_ts = Math.floor(lambda_ts || 0);
    x.lambda_ts = lambda_ts;

    if (typeof kinesis_record_ts === 'string')
      kinesis_record_ts = new Date(kinesis_record_ts || 0).getSeconds();
    kinesis_record_ts = Math.floor(kinesis_record_ts || 0);
    x.kinesis_record_ts = kinesis_record_ts;

    return {
      ...x
    };
  });

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
