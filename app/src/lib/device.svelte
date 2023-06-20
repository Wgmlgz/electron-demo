<script lang="ts">
  import { MIN_SCALE, fillArr } from './utils';
  import type { Device } from '../../../shared.d.ts';
  import { OutboundLink, OverflowMenu, OverflowMenuItem } from 'carbon-components-svelte';
  import { ButtonSet, Button } from 'carbon-components-svelte';
  import { CopyButton } from 'carbon-components-svelte';
  import moment from 'moment';
  export let device: Device;
  export let scale: number;
  import viewport from './useViewportAction';

  export let onClick: (e: MouseEvent, elem: HTMLDivElement) => void;

  let visible = false;
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
  use:viewport
  on:enterViewport={() => {
    visible = true;
  }}
  on:exitViewport={() => {
    visible = false;
  }}
  bind:this={elem}
  class="w-500px h-250px box-primary relative"
  on:dblclick={(e) => {
    onClick(e, elem);
  }}
>
  {#if visible}
    {#if !simplified}
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

      <h3 class="w-full text-center box h-50px whitespace-nowrap">
        {#if !simplified}
          {moment(device.lambda_ts * 1000).format('LLL')}
        {/if}
      </h3>
      <div class="box-secondary h-100px">
        {#if !simplified}
          <div class="flex w-500px h-50px">
            <h3 class="inline-block w-250px">
              {device.device_id}
            </h3>
            <h3 class="inline-block w-250px">
              {device.current_session_id}
            </h3>
          </div>
        {/if}
        <div class="h-50px" class:box-warning={!device.engine_id}>
          {#if !simplified}
            {#if device.engine_id}
              <p class="">
                {device.engine_id}
              </p>
            {:else}
              <h3 class="font-bold">ENGINE PATH NOT FOUND</h3>
            {/if}
          {/if}
        </div>
      </div>

      <div class="grid grid-cols-10 h-50px">
        {#each fillArr(device.actions, 10) as action}
          <h3
            class="box text-center justify-items-center"
            class:box-err={action.endsWith('-')}
            class:box-ok={action.endsWith('+')}
            class:box-unknown={action.endsWith('?')}
          >
            {#if !simplified}
              {action[0]}
            {/if}
          </h3>
        {/each}
      </div>
      {#if !simplified}
        <h2 class="text-center box h-50px">
          shrd: {device.shard_id}
        </h2>
      {/if}
    {:else}
      <div class="top-150px w-500px grid grid-cols-10 h-250px">
        {#each fillArr(device.actions, 10) as action}
          <h3
            class="box text-center justify-items-center"
            class:box-err={action.endsWith('-')}
            class:box-ok={action.endsWith('+')}
            class:box-unknown={action.endsWith('?')}
          >
            {#if !simplified}
              {action[0]}
            {/if}
          </h3>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  .box {
    @apply p-2 w-full bg-#4589ff;
  }
  .box-primary {
    @apply bg-#4589ff;
  }
  .box-secondary {
    @apply bg-gray;
  }
  .box-ok {
    @apply bg-#42be65;
  }
  .box-warning {
    @apply bg-#f1c21b;
  }
  .box-err {
    @apply bg-#da1e28;
  }
  .box-unknown {
    @apply bg-#393939;
  }
</style>
