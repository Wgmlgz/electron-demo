<script lang="ts">
  import { Bar } from 'svelte-chartjs';
  import type {
    ChartData,
    // Chart,
    // Title,
    // Tooltip,
    // Legend,
    // BarElement,
    // CategoryScale,
    // LinearScale,
    // LogarithmicScale,
    TooltipCallbacks
  } from 'chart.js';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import type { DeviceData, LambdaStats } from '../../../shared';
  import LogAxis from './scale';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  Chart.register(LogAxis);
  Chart.register(ChartDataLabels);

  let chart: Chart | null = null;
  onMount(async () => {
    const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
    Chart.register(zoomPlugin);
  });
  export let lambda_stats: DeviceData['lambda_stats'];
  let ctx: HTMLCanvasElement;
  let data: ChartData<'bar', (number | [number, number])[], unknown> = { labels: [], datasets: [] };

  const round_to = 100;

  const format = (value: number | string) => {
    const r = Math.abs(Number(value));
    const s = Math.floor(r % 60);
    const m = Math.floor(r / 60);

    let str = '';
    if (m) str += `${m}m `;
    if (1) str += `${s}s `;
    return str;
  };
  // const tooltip_cb: any = {
  //   label: (tooltipItem: any, data: any) => {
  //     return tooltipItem.yLabel.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  //   }
  // };

  $: data = {
    labels: Object.keys(lambda_stats),
    // plugins: {
    //   tooltip: {
    //     callbacks: tooltip_cb
    //   }
    // },
    datasets: [
      {
        type: 'bar',
        label: 'Queuing time',
        data: Object.values(lambda_stats).map(({ queuing_time }) => -queuing_time),
        backgroundColor: ['#da1e2840'],
        borderWidth: 2,
        borderColor: ['#da1e28'],

        datalabels: {
          offset: 0,
          anchor: 'start',
          align: 'start',
          formatter(value, context) {
            return format(value);
          },
          color: '#000'
        }
      },
      {
        type: 'bar',
        label: 'Lambda inactivity',
        data: Object.values(lambda_stats).map(({ lambda_inactivity }) => lambda_inactivity),
        backgroundColor: ['#4589ff40'],
        borderWidth: 2,
        borderColor: ['#4589ff'],
        datalabels: {
          offset: 0,
          anchor: 'end',
          align: 'end',
          formatter(value, context) {
            return format(value);
          },
          color: '#000'
        }
      },
      {
        type: 'bar',
        label: 'Max queuing time',
        data: Object.values(lambda_stats).map(({ max_queuing_time }) => -max_queuing_time),
        backgroundColor: '#0000',
        borderColor: ['rgba(255, 134, 159, 1)'],
        borderWidth: {
          top: 0,
          right: 6,
          bottom: 0,
          left: 6
        },
        datalabels: {
          anchor: 'start',
          align: 'start',
          offset: 0,
          formatter(value, context) {
            return format(value);
          },
          color: '#000'
        }
      },
      {
        type: 'bar',
        label: 'Max lambda inactivity',
        data: Object.values(lambda_stats).map(({ max_lambda_inactivity }) => max_lambda_inactivity),
        backgroundColor: '#0000',
        borderColor: ['#4589ff'],
        borderWidth: {
          top: 0,
          right: 6,
          bottom: 0,
          left: 0
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          offset: 0,
          formatter(value, context) {
            return format(value);
          },
          color: '#000'
        }
      }
    ]
  };

  Chart.defaults.set('plugins.datalabels', {
    color: '#FE777B'
  });
</script>

<div class="w-full h-full bg-white grid justify-items-center">
  <Bar
    {data}
    options={{
      responsive: true,
      indexAxis: 'y',
      animation: {
        duration: 0
      },
      scales: {
        y: {
          stacked: true,
          ticks: {
            callback: function (value, index, ticks) {
              return `shrd: ${Object.keys(lambda_stats)[Number(value)]}`;
            }
          }
        },
        x: {
          grace: '20%',
          display: true,
          // @ts-ignore
          type: 'custom_log',
          ticks: {
            callback: function (value, index, ticks) {
              return format(value);
            }
          }
        }
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true
            },
            pinch: {
              enabled: true
            },
            drag: {
              enabled: true
            },
            mode: 'y'
          }
        }
      }
    }}
  />
</div>

<div />
