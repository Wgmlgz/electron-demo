<script lang="ts">
  import DeviceComponent from '$lib/device.svelte';
  import LambdaStatsComponent from '$lib/lambda-stats.svelte';
  import type { Device, LambdaStats, DeviceData } from '../../../shared';
  import createPanZoom, { type PanZoom } from 'panzoom';
  import { onMount } from 'svelte';
  import axios from 'axios';

  let data: DeviceData = {
    devices: [],
    lambda_stats: []
  };
  onMount(async () => {
    const t = (await axios.get('http://localhost:666/')).data;
    console.log(t);
    data = t;
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

  <div class="bg-gradient-to-b from-[#80c8ff] to-[#ffc880] h-screen w-screen absolute overflow-clip">
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
        class="text-center h-full w-full grid items-center justify-items-center"
      >
        <div class="flex gap-10">
          {#each data.devices as device}
            <DeviceComponent {scale} bind:device />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
