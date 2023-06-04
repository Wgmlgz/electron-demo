<script lang="ts">
  import DeviceComponent from '$lib/device.svelte';
  import LambdaStatsComponent from '$lib/lambda-stats.svelte';
  import type { Device, LambdaStats, DeviceData } from '../../../shared';
  import createPanZoom, { type PanZoom } from 'panzoom';
  import { onMount } from 'svelte';
  import axios from 'axios';

  let data: DeviceData = {
    devices: [],
    lambda_stats: {}
  };

  const refresh = async () => {
    const t: DeviceData = (await axios.get('http://localhost:666/')).data;
    console.log(t);

    Object.entries(t.lambda_stats).forEach(([shard, value]) => {
      value.max_lambda_inactivity = Math.max(value.lambda_inactivity, data.lambda_stats[shard]?.max_lambda_inactivity || 0)
      value.max_queuing_time = Math.max(value.queuing_time, data.lambda_stats[shard]?.max_queuing_time || 0)
    })
    data = t;
  };

  onMount(async () => {
    refresh();
    setInterval(() => refresh(), 10000);
  });

  // const data: DeviceData = {
  //   devices: [
  //     {
  //       date: new Date(),
  //       deviceId: 'CBRXX1',
  //       engineId: 'Cobb_mix_2403_final',
  //       currentSessionId: 'jetson_v4.10.7.28_CGBRNT',
  //       shardId: '0003',
  //       actions: ['S+', 'C+', '3+', 'U-']
  //     },
  //     {
  //       date: new Date(),
  //       deviceId: 'CBRXX1',
  //       engineId: 'Cobb_mix_2403_final',
  //       currentSessionId: 'jetson_v4.10.7.28_CGBRNT',
  //       shardId: '0003',
  //       actions: ['S+', 'C+', '3+', 'U-']
  //     },
  //     {
  //       date: new Date(),
  //       deviceId: 'CBRXX1',
  //       engineId: 'Cobb_mix_2403_final',
  //       currentSessionId: 'jetson_v4.10.7.28_CGBRNT',
  //       shardId: '0003',
  //       actions: ['S+', 'C+', '3+', 'U-']
  //     }
  //   ],
  //   lambda_stats: [
  //     {
  //       lambda_inactivity: 12,
  //       max_lambda_inactivity: 15,
  //       queuing_time: 20,
  //       max_queuing_time: 30,
  //       shard: 'shard1'
  //     },
  //     {
  //       lambda_inactivity: 11,
  //       max_lambda_inactivity: 20,
  //       queuing_time: 15,
  //       max_queuing_time: 35,
  //       shard: 'shard_2'
  //     },
  //     {
  //       lambda_inactivity: 22,
  //       max_lambda_inactivity: 25,
  //       queuing_time: 10,
  //       max_queuing_time: 20,
  //       shard: 'shard_3'
  //     }
  //   ]
  // };
  let zoomer: HTMLElement;
  let panzoom: PanZoom | null = null;
  let scale = 1;
  onMount(() => {
    panzoom = createPanZoom(zoomer, {
      // minZoom: 0.1,
      // maxZoom: 10,
      initialZoom: 1
    });
    panzoom.on('zoom', () => {
      if (panzoom) scale = panzoom.getTransform().scale;
    });
  });
</script>

<div class="">
  <div class="h-400px w-full">
    <LambdaStatsComponent bind:lambda_stats={data.lambda_stats} />
  </div>

  <div
    class="bg-gradient-to-b from-[#80c8ff] to-[#ffc880] h-[calc(100%-400px)] w-screen absolute overflow-clip"
  >
    <div
      on:scroll={(e) => {
        console.log(e);
        console.log(panzoom?.getTransform().scale);
      }}
      bind:this={zoomer}
    >
      <div
        on:scroll={(e) => {
          console.log(e);
          console.log(panzoom?.getTransform().scale);
        }}
        class="text-center"
      >
        <div class="grid gap-10 grid-cols-10 w-max">
          {#each data.devices as device}
            <DeviceComponent {scale} bind:device />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
