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
    LogarithmicScale
  } from 'chart.js';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import type { LambdaStats } from '../../../shared';
  import LogAxis from './scale';

  Chart.register(LogAxis, ChartDataLabels);
  export let lambda_stats: LambdaStats[];

  let data: ChartData<'bar', (number | [number, number])[], unknown> = { labels: [], datasets: [] };

  $: data = {
    labels: lambda_stats.map(({ shard }) => shard),
    datasets: [
      {
        type: 'bar',
        label: 'Queuing time',
        data: lambda_stats.map(({ queuing_time }) => -queuing_time),
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
        data: lambda_stats.map(({ lambda_inactivity }) => lambda_inactivity),
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
        data: lambda_stats.map(({ max_queuing_time }) => -max_queuing_time),
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
        data: lambda_stats.map(({ max_lambda_inactivity }) => max_lambda_inactivity),
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
      scales: {
        y: {
          stacked: true
        },
        x: {
          grace: '20%',
          display: true,
          // @ts-ignore
          type: 'mylog'
        }
      }
    }}
  />
</div>

<div />
