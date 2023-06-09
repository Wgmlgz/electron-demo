<script lang="ts">
  import { MIN_SCALE } from './utils';
  import type { Device } from '../../../shared.d.ts';
  export let device: Device;
  export let scale: number;

  let simplified = false;
  $: simplified = scale <= MIN_SCALE;

  const fillArr = (actions: string, n: number = 5, sus = '  ') => {
    const arr = actions.match(/.{1,2}/g);
    if (!arr) throw Error('failed to parse actions string')
    let t = [...arr];
    for (let i = 0; i < n - t.length; ++i) {
      t.unshift(sus);
    }
    const res = t.slice(t.length - n)
    return res;
  };
</script>

<div class="flex flex-col" class:gap-2={!simplified}>
  <div class="box box-primary" class:box-hide={simplified}>
    {#if !simplified}
      <h2 class="whitespace-nowrap" class:hide={simplified}>
        {device.date}
      </h2>
    {/if}
  </div>
  <div class="box box-secondary" class:box-hide={simplified}>
    {#if !simplified}
      <div class="flex gap-2 justify-items-center items-center" class:hide={simplified}>
        <h2 class="grow">
          {device.deviceId}
        </h2>
        <div>
          <p>
            {device.currentSessionId}
          </p>
          <p class="whitespace-nowrap">
            {device.engineId}
          </p>
        </div>
      </div>
    {/if}
  </div>

  <div class="grid grid-cols-5" class:gap-x-2={!simplified}>
    {#each fillArr(device.actions, 5) as action}
      <div
        class="box grid items-center justify-items-center"
        class:box-err={action.endsWith('-')}
        class:box-ok={action.endsWith('+')}
        class:box-hide={simplified}
      >
        {#if !simplified}
          <h3 class:hide={simplified}>
            {action[0]}
          </h3>
        {/if}
      </div>
    {/each}
  </div>
  <div class="box" class:box-hide={simplified}>
    {#if !simplified}
      <h2 class:hide={simplified}>
        shrd: {device.shardId}
      </h2>
    {/if}
  </div>
</div>

<style lang="scss">
  .box {
    @apply p-2 w-full bg-blue border-#009 border-solid border-2;
  }
  .box-primary {
    @apply bg-blue border-#009;
  }
  .box-secondary {
    @apply bg-gray border-#009;
  }
  .box-hide {
    border: none !important;
  }
  .hide {
    @apply opacity-0;
  }
  .box-ok {
    @apply border-green bg-#55ff55;
  }
  .box-err {
    @apply border-red bg-#ff5555;
  }
</style>
