<script lang="ts">
  import DeviceComponent from '$lib/device.svelte';
  import type { Device } from '$lib/utils';
  import createPanZoom, { type PanZoom } from 'panzoom';
  import { onMount } from 'svelte';

  interface DeviceData {
    devices: Device[];
  }
  const data: DeviceData = {
    devices: [
      {
        date: new Date(),
        deviceId: 'CBRXX1',
        engineId: 'Cobb_mix_2403_final',
        currentSessionId: 'jetson_v4.10.7.28_CGBRNT',
        shardId: '0003',
        actions: ['S+', 'C+', '3+', 'U-']
      },
      {
        date: new Date(),
        deviceId: 'CBRXX1',
        engineId: 'Cobb_mix_2403_final',
        currentSessionId: 'jetson_v4.10.7.28_CGBRNT',
        shardId: '0003',
        actions: ['S+', 'C+', '3+', 'U-']
      },
      {
        date: new Date(),
        deviceId: 'CBRXX1',
        engineId: 'Cobb_mix_2403_final',
        currentSessionId: 'jetson_v4.10.7.28_CGBRNT',
        shardId: '0003',
        actions: ['S+', 'C+', '3+', 'U-']
      }
    ]
  };
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

<div class="h-screen w-screen absolute overflow-clip">
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
