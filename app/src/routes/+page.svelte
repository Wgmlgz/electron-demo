<script lang="ts">
  import DeviceComponent from '$lib/device.svelte';
  import LambdaStatsComponent from '$lib/lambda-stats.svelte';
  import type { Device, LambdaStats, DeviceData } from '../../../shared';
  import Panzoom, { type PanzoomObject } from '@panzoom/panzoom';
  import { onMount } from 'svelte';
  import { PUBLIC_BASE_URL } from '$env/static/public';
  import axios from 'axios';

  let data: DeviceData = {
    devices: [],
    lambda_stats: {}
  };

  const refresh = async () => {
    const t: DeviceData = (await axios.get(PUBLIC_BASE_URL)).data;
    console.log(t);

    Object.entries(t.lambda_stats).forEach(([shard, value]) => {
      value.max_lambda_inactivity = Math.max(
        value.lambda_inactivity,
        data.lambda_stats[shard]?.max_lambda_inactivity || 0
      );
      value.max_queuing_time = Math.max(
        value.queuing_time,
        data.lambda_stats[shard]?.max_queuing_time || 0
      );
    });
    data = t;
  };

  onMount(async () => {
    refresh();
    setInterval(() => refresh(), 10000);
  });
  let zoomer: HTMLElement;
  let panzoom: PanzoomObject | null = null;
  let scale = 1;
  onMount(() => {
    panzoom = Panzoom(zoomer, {
      // minZoom: 0.1,
      // maxZoom: 10,
      overflow: 'auto',
      initialZoom: 1
    });
    // panzoom.ge('zoom', () => {
    //   if (panzoom) scale = panzoom.getTransform().scale;
    // });
    // panzoom.on('scroll', (e) => {
    //   console.log(e);
    // });
  });
</script>

<div class="">
  <div class="h-400px w-full overflow-y-scroll">
    <LambdaStatsComponent bind:lambda_stats={data.lambda_stats} />
  </div>

  <div
    class="bg-gradient-to-b from-[#80c8ff] to-[#ffc880] h-[calc(100%-400px)] w-screen absolute overflow-x-clip overflow-y-scroll"
  >
    <div
      on:wheel={(e) => {
        if (e.shiftKey) return;
        panzoom?.zoomWithWheel(e);
      }}
      bind:this={zoomer}
    >
      <div class="text-center">
        <div class="grid gap-10 grid-cols-10 w-max">
          {#each data.devices as device}
            <DeviceComponent {scale} bind:device />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
