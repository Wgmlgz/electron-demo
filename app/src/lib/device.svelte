<script lang="ts">
  import { MIN_SCALE, fillArr } from './utils';
  import type { Device } from '../../../shared.d.ts';
  import { OutboundLink, OverflowMenu, OverflowMenuItem } from 'carbon-components-svelte';
  import { ButtonSet, Button } from 'carbon-components-svelte';
  import { CopyButton } from 'carbon-components-svelte';
      import moment from 'moment';
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
              `ENGINE_${device.device_id}`
            )}$26start$3D-3600000`}
          >
            Cloudwatch logs
          </OutboundLink>
        </OverflowMenuItem>

        <div class="flex items-center w-full">
          <div class="grow grid content-center">
            <div>Copy device id</div>
          </div>
          <CopyButton text={device.device_id} />
        </div>

        <div class="flex items-center w-full">
          <div class="grow grid content-center">
            <div>Copy session id</div>
          </div>
          <CopyButton text={device.current_session_id} />
        </div>

        <div class="flex items-center w-full">
          <div class="grow grid content-center">
            <div>Copy engine name</div>
          </div>
          <CopyButton text={device.engine_id} />
        </div>
      </OverflowMenu>
    </ButtonSet>
  </div>
  <div class="grid content-center box box-primary h-50px" class:box-hide={simplified}>
    {#if !simplified}
      <h3 class="whitespace-nowrap" class:hide={simplified}>
        {moment(device.lambda_ts * 1000).format('LLL')}
      </h3>
    {/if}
  </div>
  <div class="box box-secondary h-50px" class:box-hide={simplified}>
    {#if !simplified}
      <div class="flex content-center content-center" class:hide={simplified}>
        <h3 class="grow">
          {device.device_id}
        </h3>
        <h3 class="grow">
          {device.current_session_id}
        </h3>
      </div>
    {/if}
  </div>
  <div
    class="box box-secondary h-50px grid content-center"
    class:box-warning={!device.engine_id}
    class:box-hide={simplified}
  >
    {#if !simplified}
      <div class:hide={simplified}>
        {#if device.engine_id}
          <p class="">
            {device.engine_id}
          </p>
        {:else}
          <h3 class="font-bold">ENGINE PATH NOT FOUND</h3>
        {/if}
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
        shrd: {device.shard_id}
      </h2>
    {/if}
  </div>
</div>

<style lang="scss">
  .box {
    @apply p-2 w-full bg-#4589ff border-#009;
  }
  .box-primary {
    @apply bg-#4589ff border-#009;
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
    @apply border-green bg-#42be65;
  }
  .box-warning {
    @apply border-green bg-#f1c21b;
  }
  .box-err {
    @apply border-red bg-#da1e28;
  }
  .box-unknown {
    @apply border-#555 bg-#393939;
  }
</style>
