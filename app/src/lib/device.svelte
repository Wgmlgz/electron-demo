<script lang="ts">
  import { MIN_SCALE, fillArr } from './utils';
  import type { Device } from '../../../shared.d.ts';
  import { OutboundLink, OverflowMenu, OverflowMenuItem } from 'carbon-components-svelte';
  import { ButtonSet, Button } from 'carbon-components-svelte';
  export let device: Device;
  export let scale: number;
  export let onClick: (e: MouseEvent, elem: HTMLDivElement) => void;

  let simplified = false;
  $: {
    const new_simplified = scale <= MIN_SCALE;
    if (new_simplified !== simplified) {
      setTimeout(() => {
        simplified = new_simplified;
      });
    }
  }
  let elem: HTMLDivElement;
  
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={elem}
  class="flex flex-col w-500px relative"
  on:dblclick={(e) => {
    onClick(e, elem);
  }}
>
  <div class="absolute top-1px right-2px">
    <ButtonSet>
      <OverflowMenu flipped light size="xl">
        <OverflowMenuItem>
          <OutboundLink
            class="whitespace-nowrap"
            href={`https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Flambda$252Flog-test/log-events$3FfilterPattern$3D${encodeURI(
              `ENGINE_${device.deviceId}`
            )}$26start$3D-3600000`}
          >
            Cloudwatch logs
          </OutboundLink>
        </OverflowMenuItem>
      </OverflowMenu>
    </ButtonSet>
  </div>
  <div class="grid content-center box box-primary h-50px" class:box-hide={simplified}>
    {#if !simplified}
      <h3 class="whitespace-nowrap" class:hide={simplified}>
        {device.date}
      </h3>
    {/if}
  </div>
  <div class="box box-secondary h-100px" class:box-hide={simplified}>
    {#if !simplified}
      <div class="flex content-center" class:hide={simplified}>
        <h3 class="grow">
          {device.deviceId}
        </h3>
        <div class="grow">
          <p>
            {device.currentSessionId}
          </p>
          <p class="text-wrap">
            {device.engineId}
          </p>
        </div>
      </div>
    {/if}
  </div>

  <div class="grid grid-cols-10 h-50px">
    {#each fillArr(device.actions, 10) as action}
      <div
        class="box grid items-center justify-items-center"
        class:box-err={action.endsWith('-')}
        class:box-ok={action.endsWith('+')}
        class:box-unknown={action.endsWith('?')}
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
  <div class="grid content-center box h-50px" class:box-hide={simplified}>
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
    @apply border-green bg-[rgb(34,177,76)];
  }
  .box-err {
    @apply border-red bg-#ff5555;
  }
  .box-unknown {
    @apply border-#555 bg-#333;
  }
</style>
