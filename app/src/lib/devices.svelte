<script lang="ts">
  import type { D3ZoomEvent } from 'd3';
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import type { Device } from '../../../shared';

  const PER_ROW = 20;
  const DEVICE_W = 500;
  const DEVICE_H = 250;
  const GAP_X = 50;
  const GAP_Y = 50;
  let w = 200;
  let h = 200;

  let IMAGE_WIDTH = 400;
  let IMAGE_HEIGHT = 400;

  export let devices: Device[];
  $: {
    IMAGE_WIDTH = w * 20;
    IMAGE_HEIGHT = h * 20;
  }

  $: {
    console.log(devices);
    const dots = d3
      .select(g)
      .selectAll('rect')
      .data(devices)
      .join('rect')
      .attr('width', DEVICE_W)
      .attr('height', DEVICE_H)
      .attr('fill', 'lightgreen')
      .attr('font-size', '50px')
      .attr('x', function (d, idx, arr) {
        return (idx % PER_ROW) * (DEVICE_W + GAP_X)
        //  + (PER_ROW * (DEVICE_W + GAP_X)) / 2;
      })
      .attr('y', function (d, idx, arr) {
        return (
          Math.floor(idx / PER_ROW) * (DEVICE_H + GAP_Y)
          //  + (Math.floor(arr.length / PER_ROW) * (DEVICE_H + GAP_Y)) / 2
        );
      })
      // .text(function(d) { return d.device_id });

      const texts = d3
      .select(g)
      .selectAll('text')
      .data(devices)
      .join('text')
      .attr('width', DEVICE_W)
      .attr('height', DEVICE_H)
      // .attr('fill', 'lightgreen')
      .attr('font-size', '50px')
      .attr('x', function (d, idx, arr) {
        return (idx % PER_ROW) * (DEVICE_W + GAP_X)
        //  + (PER_ROW * (DEVICE_W + GAP_X)) / 2;
      })
      .attr('y', function (d, idx, arr) {
        return (
          Math.floor(idx / PER_ROW) * (DEVICE_H + GAP_Y)
          //  + (Math.floor(arr.length / PER_ROW) * (DEVICE_H + GAP_Y)) / 2
        );
      })
      .text(function(d) { return d.device_id });

    // dots
    //   .append('rect')
    //   .attr('x', 10)
    //   .attr('y', 5)
    //   .attr('width', 2000)
    //   .attr('height', 1000)
    //   .attr('fill', 'lightgreen');
  }

  let el: HTMLDivElement;
  let svg: SVGElement;
  let g: SVGGElement;

  function zoomed(event: D3ZoomEvent) {
    const scale = event.transform.k;

    const scaledWidth = IMAGE_WIDTH * scale;
    const scaledHeight = IMAGE_HEIGHT * scale;

    // Change SVG dimensions.
    d3.select(svg).attr('width', scaledWidth).attr('height', scaledHeight);

    // Scale the image itself.
    d3.select(g).attr('transform', `scale(${scale})`);

    // Move scrollbars.
    const wrapper = d3.select(el).node();
    wrapper.scrollLeft = -event.transform.x;
    wrapper.scrollTop = -event.transform.y;

    // If the image is smaller than the wrapper, move the image towards the
    // center of the wrapper.
    const dx = d3.max([0, wrapper.clientWidth / 2 - scaledWidth / 2]);
    const dy = d3.max([0, wrapper.clientHeight / 2 - scaledHeight / 2]);
    d3.select(svg).attr('transform', `translate(${dx}, ${dy})`);
  }

  function scrolled() {
    const wrapper = d3.select(el);
    const x = wrapper.node().scrollLeft + wrapper.node().clientWidth / 2;
    const y = wrapper.node().scrollTop + wrapper.node().clientHeight / 2;
    const scale = d3.zoomTransform(wrapper.node()).k;
    // Update zoom parameters based on scrollbar positions.
    wrapper.call(d3.zoom().translateTo, x / scale, y / scale);
  }

  onMount(() => {
    // Set initial SVG dimensions.
    d3.select(svg).attr('width', IMAGE_WIDTH).attr('height', IMAGE_HEIGHT);

    // Set up d3-zoom and callbacks.
    d3.select(el)
      .on('scroll', scrolled)
      .call(
        d3
          .zoom()
          .scaleExtent([0.1, 10])
          // .translateExtent([
          //   [0, 0],
          //   [IMAGE_WIDTH, IMAGE_HEIGHT]
          // ])
          .on('zoom', zoomed)
      );
  });
</script>

<div
  bind:this={el}
  bind:clientWidth={w}
  bind:clientHeight={h}
  class="w-full h-full overflow-auto border-solid border-#009 border-2"
>
  <svg bind:this={svg} width="400" height="400">
    <g bind:this={g} />
  </svg>
</div>
