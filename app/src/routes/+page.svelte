<script lang="ts">
  import DeviceComponent from '$lib/device.svelte';
  import LambdaStatsComponent from '$lib/lambda-stats.svelte';
  import type { Device, LambdaStats, DeviceData } from '../../../shared';
  import Panzoom, { type PanzoomObject } from '@panzoom/panzoom';
  import { onMount } from 'svelte';
  import { PUBLIC_BASE_URL } from '$env/static/public';
  import axios from 'axios';
  import { Select, SelectItem, ProgressBar, Checkbox } from 'carbon-components-svelte';
  import { fillArr } from '$lib/utils';

  let data: DeviceData = {
    devices: [],
    problematic: [],
    lambda_stats: {}
  };

  let loading = false;
  const refresh = async () => {
    loading = true;
    const t: DeviceData = (await axios.get(PUBLIC_BASE_URL)).data;
    console.log('update');

    for (const shard in t.lambda_stats) {
      const value = t.lambda_stats[shard];
      value.max_lambda_inactivity = Math.max(
        value.lambda_inactivity,
        data.lambda_stats[shard]?.max_lambda_inactivity || 0
      );
      value.max_queuing_time = Math.max(
        value.queuing_time,
        data.lambda_stats[shard]?.max_queuing_time || 0
      );
    }
    data = t;
    data.problematic = data.devices.filter((device) =>
      fillArr(device.actions, 10).some((x) => x.endsWith('-'))
    );
    loading = false;
  };

  const updateScale = () => {
    if (!panzoom) return;
    scale = panzoom?.getScale();
  };
  const deviceClick = (e: MouseEvent, elem: HTMLDivElement) => {
    const x = elem.clientLeft;
    const y = elem.clientTop;
    if (!panzoom) return;
    panzoom.zoomToPoint(1, e, {
      animate: true,
      duration: 100
    });
    updateScale();
  };

  const fn = async () => {
    await refresh();
    console.log(refresh_delay);
    timer = setTimeout(fn, refresh_delay);
  };

  const setTimer = () => {
    if (timer) clearTimeout(timer);
    console.log(refresh_delay);

    timer = setTimeout(fn, refresh_delay);
  };

  let zoomer: HTMLElement;
  let panzoom: PanzoomObject | null = null;
  let scale = 1;

  let timer: NodeJS.Timer | null = null;
  onMount(async () => {
    panzoom = Panzoom(zoomer, {
      minZoom: 0.0,
      maxZoom: 10,
      origin: '50% 50%',
      overflow: 'scroll',
      initialZoom: 1
    });
    await refresh();

    // setTimer(refresh_delay);
  });

  let refresh_delay = 10000;
  let only_problematic = false;
  $: {
    if (refresh_delay) setTimer();
  }
  $: {
    only_problematic = only_problematic;
    panzoom?.reset({ animate: true });
    updateScale();
  }
</script>

<svelte:head>
  <title>{loading ? '(updating)' : ''} Split engine dashboard</title>
</svelte:head>

<div class="">
  <div class="h-400px w-full p-2 flex flex-row">
    <LambdaStatsComponent bind:lambda_stats={data.lambda_stats} />
    <div class="w-150px flex flex-col gap-2 h-full">
      <div class="h-min">
        <Select
          labelText="Refresh delay"
          bind:selected={refresh_delay}
          on:change={(e) => console.log('value', refresh_delay)}
        >
          <SelectItem text={'1s'} value={1 * 1000} />
          <SelectItem text={'10s'} value={10 * 1000} />
          <SelectItem text={'30s'} value={30 * 1000} />
          <SelectItem text={'1m'} value={1 * 60 * 1000} />
          <SelectItem text={'5m'} value={5 * 60 * 1000} />
          <SelectItem text={'10m'} value={10 * 60 * 1000} />
        </Select>
      </div>

      {#if loading}
        <div class="">
          <ProgressBar helperText="Loading..." />
        </div>
      {/if}

      <div class="mt-auto">
        <Checkbox labelText="Display only problematic devices" bind:checked={only_problematic} />
      </div>
    </div>
  </div>

  <div
    class="bg-gradient-to-b from-[#80c8ff] to-[#ffc880] h-[calc(100%-400px)] w-screen absolute overflow-x-clip overflow-y-scroll"
    on:wheel|preventDefault
  >
    <div
      on:wheel={(e) => {
        if (e.shiftKey) return;
        panzoom?.zoomWithWheel(e);
        updateScale();
      }}
      bind:this={zoomer}
    >
      <div class="text-center text-white">
        {#if only_problematic}
          <div class="grid gap-10 grid-cols-10 w-max">
            {#each data.problematic || [] as device}
              <DeviceComponent onClick={deviceClick} {scale} bind:device />
            {/each}
          </div>
        {:else}
          <div class="grid gap-10 grid-cols-10 w-max">
            {#each data.devices as device}
              <DeviceComponent onClick={deviceClick} {scale} bind:device />
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
