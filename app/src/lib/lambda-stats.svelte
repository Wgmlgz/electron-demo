<script lang="ts">
  import { Bar } from 'svelte-chartjs';
  import {
    type ChartData,
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    type TooltipCallbacks
  } from 'chart.js';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import type { DeviceData, LambdaStats } from '../../../shared';
  import LogAxis from './scale';

  Chart.register(LogAxis, ChartDataLabels, Tooltip);
  export let lambda_stats: DeviceData['lambda_stats'];

  let data: ChartData<'bar', (number | [number, number])[], unknown> = { labels: [], datasets: [] };

  const round_to = 100;
  const prepare = (x: number) => Math.round((x / (1000 * 60)) * round_to) / round_to;

  const tooltip_cb: any = {
    label: (tooltipItem: any, data: any) => {
      return tooltipItem.yLabel.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
  };

  $: data = {
    labels: Object.keys(lambda_stats),
    plugins: {
      tooltip: {
        callbacks: tooltip_cb
      }
    },
    datasets: [
      {
        type: 'bar',
        label: 'Queuing time',
        data: Object.values(lambda_stats).map(({ queuing_time }) => -prepare(queuing_time)),
        backgroundColor: ['rgba(255, 134,159,0.4)'],
        borderWidth: 2,
        borderColor: ['rgba(255, 134, 159, 1)'],

        datalabels: {
          offset: 0,
          anchor: 'start',
          align: 'start',
          formatter(value, context) {
            return `${Math.abs(value)} m`;
          },
          color: '#000'
        }
      },
      {
        type: 'bar',
        label: 'Lambda inactivity',
        data: Object.values(lambda_stats).map(({ lambda_inactivity }) =>
          prepare(lambda_inactivity)
        ),
        backgroundColor: ['rgba(98,  182, 239,0.4)'],
        borderWidth: 2,
        borderColor: ['rgba(98,  182, 239, 1)'],
        datalabels: {
          offset: 0,
          anchor: 'end',
          align: 'end',
          formatter(value, context) {
            return `${Math.abs(value)} m`;
          },
          color: '#000'
        }
      },
      {
        type: 'bar',
        label: 'Max queuing time',
        data: Object.values(lambda_stats).map(({ max_queuing_time }) => -prepare(max_queuing_time)),
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
            return `${Math.abs(value)} m`;
          },
          color: '#000'
        }
      },
      {
        type: 'bar',
        label: 'Max lambda inactivity',
        data: Object.values(lambda_stats).map(({ max_lambda_inactivity }) =>
          prepare(max_lambda_inactivity)
        ),
        backgroundColor: '#0000',
        borderColor: ['rgba(98,  182, 239, 1)'],
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
            return `${Math.abs(value)} m`;
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
              return Object.keys(lambda_stats)[Number(value)];
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
              return Math.abs(Number(value));
            }
          }
        }
      },
    }}
  />
</div>

<div />