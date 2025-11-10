import { useState } from 'react';
import ReactECharts from 'echarts-for-react';

const SimulationPanel = ({ isOpen, onClose, simulationType, embedded = false }) => {
  if (!isOpen) return null;

  const getChartOption = () => {
    switch (simulationType) {
      case 'network-sim':
        return {
          title: {
            text: 'Vehicle Network Communication Analysis',
            subtext: 'Real-time Message Throughput & Bus Load',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: '700', color: '#24292f' },
            subtextStyle: { fontSize: 13, color: '#57606a' }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
            formatter: (params) => {
              let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
              params.forEach(item => {
                result += `<div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">
                  <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 6px;"></span>${item.seriesName}</span>
                  <span style="margin-left: 20px; font-weight: 600;">${item.value} msg/s</span>
                </div>`;
              });
              return result;
            }
          },
          legend: {
            data: ['CAN Bus 1', 'CAN Bus 2', 'CAN-FD', 'Ethernet (ADAS)', 'Ethernet (Gateway)', 'FlexRay', 'LIN'],
            bottom: 15,
            itemGap: 20,
            textStyle: { fontSize: 12, color: '#24292f' }
          },
          grid: { left: '3%', right: '4%', bottom: '15%', top: '18%', containLabel: true },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0ms', '50ms', '100ms', '150ms', '200ms', '250ms', '300ms', '350ms', '400ms', '450ms', '500ms'],
            axisLabel: { fontSize: 11, color: '#57606a' },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          yAxis: {
            type: 'value',
            name: 'Messages/s',
            nameTextStyle: { fontSize: 12, color: '#24292f', padding: [0, 0, 0, 10] },
            axisLabel: { fontSize: 11, color: '#57606a' },
            splitLine: { lineStyle: { color: '#eaecef', type: 'dashed' } },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          series: [
            {
              name: 'CAN Bus 1',
              type: 'line',
              data: [425, 438, 445, 432, 428, 442, 456, 448, 435, 441, 450],
              smooth: true,
              lineStyle: { width: 2.5, color: '#cf222e' },
              itemStyle: { color: '#cf222e' },
              areaStyle: { opacity: 0.15, color: '#cf222e' },
              emphasis: { focus: 'series' },
              markLine: {
                data: [{ type: 'average', name: 'Avg', lineStyle: { type: 'dashed', color: '#cf222e', opacity: 0.5 } }]
              }
            },
            {
              name: 'CAN Bus 2',
              type: 'line',
              data: [380, 392, 405, 398, 388, 395, 402, 410, 398, 405, 412],
              smooth: true,
              lineStyle: { width: 2.5, color: '#fb8500' },
              itemStyle: { color: '#fb8500' },
              areaStyle: { opacity: 0.15, color: '#fb8500' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'CAN-FD',
              type: 'line',
              data: [1250, 1320, 1280, 1350, 1420, 1380, 1450, 1490, 1520, 1480, 1550],
              smooth: true,
              lineStyle: { width: 3, color: '#ff8c42' },
              itemStyle: { color: '#ff8c42' },
              areaStyle: { opacity: 0.2, color: '#ff8c42' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'Ethernet (ADAS)',
              type: 'line',
              data: [8200, 8850, 9200, 9650, 10200, 10800, 11200, 11500, 11800, 12100, 12450],
              smooth: true,
              lineStyle: { width: 3, color: '#0969da' },
              itemStyle: { color: '#0969da' },
              areaStyle: { opacity: 0.2, color: '#0969da' },
              emphasis: { focus: 'series' },
              markPoint: {
                data: [{ type: 'max', name: 'Peak' }],
                itemStyle: { color: '#0969da' }
              }
            },
            {
              name: 'Ethernet (Gateway)',
              type: 'line',
              data: [6500, 6800, 7100, 7400, 7650, 7900, 8150, 8350, 8550, 8720, 8900],
              smooth: true,
              lineStyle: { width: 2.5, color: '#1f883d' },
              itemStyle: { color: '#1f883d' },
              areaStyle: { opacity: 0.15, color: '#1f883d' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'FlexRay',
              type: 'line',
              data: [520, 535, 548, 542, 555, 568, 575, 582, 590, 595, 605],
              smooth: true,
              lineStyle: { width: 2, color: '#8250df' },
              itemStyle: { color: '#8250df' },
              areaStyle: { opacity: 0.1, color: '#8250df' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'LIN',
              type: 'line',
              data: [42, 45, 48, 46, 49, 52, 54, 53, 55, 56, 58],
              smooth: true,
              lineStyle: { width: 2, color: '#4ecdc4', type: 'dashed' },
              itemStyle: { color: '#4ecdc4' },
              emphasis: { focus: 'series' }
            }
          ],
          dataZoom: [
            { type: 'inside', start: 0, end: 100 },
            { start: 0, end: 100, height: 20, bottom: 45 }
          ]
        };

      case 'bandwidth-analysis':
        return {
          title: {
            text: 'Network Bandwidth Distribution',
            subtext: 'Domain-based Utilization & Reserved Capacity',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: '700', color: '#24292f' },
            subtextStyle: { fontSize: 13, color: '#57606a' }
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const percent = params.percent.toFixed(1);
              const util = ((params.value / 1000) * 100).toFixed(1);
              return `<div style="font-weight: 600; margin-bottom: 6px;">${params.name}</div>
                <div style="color: #57606a; font-size: 12px; margin: 2px 0;">Bandwidth: <span style="font-weight: 600; color: #24292f;">${params.value} Mbps</span></div>
                <div style="color: #57606a; font-size: 12px; margin: 2px 0;">Share: <span style="font-weight: 600; color: #24292f;">${percent}%</span></div>
                <div style="color: #57606a; font-size: 12px; margin: 2px 0;">Utilization: <span style="font-weight: 600; color: ${util > 85 ? '#cf222e' : util > 70 ? '#fb8500' : '#1f883d'};">${util}%</span></div>`;
            }
          },
          legend: {
            orient: 'vertical',
            left: '65%',
            top: 'center',
            itemGap: 15,
            textStyle: { fontSize: 13, color: '#24292f' },
            formatter: (name) => {
              const data = {
                'ADAS Domain': '750 Mbps',
                'Body Domain': '420 Mbps',
                'Powertrain': '280 Mbps',
                'Chassis': '220 Mbps',
                'Infotainment': '180 Mbps',
                'Gateway': '320 Mbps',
                'Reserved': '150 Mbps'
              };
              return `${name}  ${data[name]}`;
            }
          },
          series: [
            {
              name: 'Bandwidth Allocation',
              type: 'pie',
              radius: ['35%', '65%'],
              center: ['30%', '50%'],
              avoidLabelOverlap: true,
              padAngle: 2,
              itemStyle: {
                borderRadius: 8,
                borderColor: '#ffffff',
                borderWidth: 3,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              },
              label: {
                show: true,
                formatter: '{d}%',
                fontSize: 13,
                fontWeight: '600',
                color: '#24292f'
              },
              labelLine: {
                show: true,
                length: 15,
                length2: 10,
                lineStyle: { color: '#d0d7de' }
              },
              emphasis: {
                label: { show: true, fontSize: 16, fontWeight: 'bold' },
                itemStyle: { shadowBlur: 20, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' },
                scaleSize: 10
              },
              data: [
                { value: 750, name: 'ADAS Domain', itemStyle: { color: '#0969da' } },
                { value: 420, name: 'Body Domain', itemStyle: { color: '#1f883d' } },
                { value: 280, name: 'Powertrain', itemStyle: { color: '#8250df' } },
                { value: 220, name: 'Chassis', itemStyle: { color: '#fb8500' } },
                { value: 180, name: 'Infotainment', itemStyle: { color: '#cf222e' } },
                { value: 320, name: 'Gateway', itemStyle: { color: '#4ecdc4' } },
                { value: 150, name: 'Reserved', itemStyle: { color: '#d0d7de' } }
              ]
            },
            {
              name: 'Inner Ring',
              type: 'pie',
              radius: ['0%', '30%'],
              center: ['30%', '50%'],
              silent: true,
              label: { show: false },
              labelLine: { show: false },
              itemStyle: { color: '#f6f8fa', borderColor: '#d0d7de', borderWidth: 2 },
              data: [{ value: 1, name: 'Total\n2320 Mbps' }]
            }
          ]
        };

      case 'latency-test':
        return {
          title: {
            text: 'End-to-End Communication Latency',
            subtext: 'Critical Path Analysis & Performance Thresholds',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: '700', color: '#24292f' },
            subtextStyle: { fontSize: 13, color: '#57606a' }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params) => {
              const item = params[0];
              const status = item.value < 5 ? 'Excellent' : item.value < 10 ? 'Good' : item.value < 15 ? 'Warning' : 'Critical';
              const statusColor = item.value < 5 ? '#1f883d' : item.value < 10 ? '#0969da' : item.value < 15 ? '#fb8500' : '#cf222e';
              return `<div style="font-weight: 600; margin-bottom: 8px;">${item.name}</div>
                <div style="margin: 4px 0;">Latency: <span style="font-weight: 700; color: ${item.color};">${item.value} ms</span></div>
                <div style="margin: 4px 0;">Status: <span style="font-weight: 600; color: ${statusColor};">${status}</span></div>
                <div style="font-size: 11px; color: #656d76; margin-top: 6px;">Target: &lt; 10ms</div>`;
            }
          },
          grid: { left: '22%', right: '8%', bottom: '12%', top: '18%', containLabel: false },
          xAxis: {
            type: 'value',
            name: 'Latency (ms)',
            nameLocation: 'middle',
            nameGap: 30,
            nameTextStyle: { fontSize: 13, color: '#24292f', fontWeight: '600' },
            max: 20,
            axisLabel: { fontSize: 11, color: '#57606a' },
            splitLine: { lineStyle: { color: '#eaecef', type: 'dashed' } },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          yAxis: {
            type: 'category',
            data: [
              'Camera→ADAS DC',
              'Radar→ADAS DC',
              'ADAS DC→Gateway',
              'Gateway→Body DC',
              'Body DC→BCM',
              'Gateway→Powertrain',
              'Lidar→ADAS DC',
              'ADAS DC→Display',
              'Gateway→Chassis',
              'Sensor→Body DC'
            ],
            axisLabel: { fontSize: 12, color: '#24292f', fontWeight: '500' },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          series: [
            {
              name: 'Latency',
              type: 'bar',
              barWidth: '60%',
              data: [
                { value: 3.2, itemStyle: { color: '#1f883d', borderRadius: [0, 4, 4, 0] } },
                { value: 4.5, itemStyle: { color: '#1f883d', borderRadius: [0, 4, 4, 0] } },
                { value: 2.8, itemStyle: { color: '#1f883d', borderRadius: [0, 4, 4, 0] } },
                { value: 1.9, itemStyle: { color: '#1f883d', borderRadius: [0, 4, 4, 0] } },
                { value: 6.3, itemStyle: { color: '#0969da', borderRadius: [0, 4, 4, 0] } },
                { value: 8.7, itemStyle: { color: '#0969da', borderRadius: [0, 4, 4, 0] } },
                { value: 5.1, itemStyle: { color: '#0969da', borderRadius: [0, 4, 4, 0] } },
                { value: 11.2, itemStyle: { color: '#fb8500', borderRadius: [0, 4, 4, 0] } },
                { value: 14.8, itemStyle: { color: '#fb8500', borderRadius: [0, 4, 4, 0] } },
                { value: 18.5, itemStyle: { color: '#cf222e', borderRadius: [0, 4, 4, 0] } }
              ],
              label: {
                show: true,
                position: 'right',
                formatter: '{c} ms',
                fontSize: 11,
                fontWeight: '600',
                color: '#24292f'
              },
              markLine: {
                silent: true,
                lineStyle: { color: '#fb8500', type: 'dashed', width: 2 },
                label: {
                  formatter: 'Target: 10ms',
                  position: 'insideEndTop',
                  fontSize: 11,
                  color: '#fb8500',
                  fontWeight: '600'
                },
                data: [{ xAxis: 10 }]
              },
              emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' }
              }
            }
          ]
        };

      case 'load-test':
        return {
          title: {
            text: 'System Load & Resource Utilization',
            subtext: 'Real-time Performance Monitoring Under Stress',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: '700', color: '#24292f' },
            subtextStyle: { fontSize: 13, color: '#57606a' }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
            formatter: (params) => {
              let result = `<div style="font-weight: 600; margin-bottom: 8px;">Time: ${params[0].axisValue}</div>`;
              params.forEach(item => {
                const status = item.value > 90 ? 'Critical' : item.value > 75 ? 'High' : item.value > 50 ? 'Medium' : 'Normal';
                const statusColor = item.value > 90 ? '#cf222e' : item.value > 75 ? '#fb8500' : item.value > 50 ? '#0969da' : '#1f883d';
                result += `<div style="margin: 4px 0;">
                  <div><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 6px;"></span>${item.seriesName}: <span style="font-weight: 700;">${item.value}%</span></div>
                  <div style="font-size: 11px; color: ${statusColor}; margin-left: 16px;">${status}</div>
                </div>`;
              });
              return result;
            }
          },
          legend: {
            data: ['CPU Usage', 'Memory Usage', 'Network Load', 'GPU Usage', 'Disk I/O'],
            bottom: 15,
            itemGap: 25,
            textStyle: { fontSize: 12, color: '#24292f' }
          },
          grid: { left: '3%', right: '4%', bottom: '15%', top: '18%', containLabel: true },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0s', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', '11s', '12s', '13s', '14s', '15s'],
            axisLabel: { fontSize: 11, color: '#57606a' },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          yAxis: {
            type: 'value',
            name: 'Usage (%)',
            max: 100,
            nameTextStyle: { fontSize: 12, color: '#24292f', padding: [0, 0, 0, 10] },
            axisLabel: { fontSize: 11, color: '#57606a', formatter: '{value}%' },
            splitLine: { lineStyle: { color: '#eaecef', type: 'dashed' } },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          series: [
            {
              name: 'CPU Usage',
              type: 'line',
              data: [28, 32, 38, 45, 52, 61, 68, 75, 82, 88, 91, 89, 85, 78, 72, 68],
              smooth: true,
              lineStyle: { width: 3, color: '#0969da' },
              itemStyle: { color: '#0969da' },
              areaStyle: { opacity: 0.25, color: '#0969da' },
              emphasis: { focus: 'series' },
              markLine: {
                silent: true,
                lineStyle: { color: '#cf222e', type: 'dashed', width: 2, opacity: 0.6 },
                label: { formatter: 'Critical: 90%', position: 'insideEndTop', color: '#cf222e', fontSize: 11 },
                data: [{ yAxis: 90 }]
              },
              markPoint: {
                data: [{ type: 'max', name: 'Peak', itemStyle: { color: '#0969da' } }]
              }
            },
            {
              name: 'Memory Usage',
              type: 'line',
              data: [42, 45, 48, 51, 55, 58, 62, 65, 68, 71, 74, 76, 78, 79, 80, 81],
              smooth: true,
              lineStyle: { width: 2.5, color: '#1f883d' },
              itemStyle: { color: '#1f883d' },
              areaStyle: { opacity: 0.2, color: '#1f883d' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'Network Load',
              type: 'line',
              data: [18, 22, 32, 45, 58, 68, 75, 78, 72, 65, 58, 48, 38, 32, 28, 25],
              smooth: true,
              lineStyle: { width: 2.5, color: '#8250df' },
              itemStyle: { color: '#8250df' },
              areaStyle: { opacity: 0.2, color: '#8250df' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'GPU Usage',
              type: 'line',
              data: [35, 38, 42, 48, 55, 62, 68, 72, 76, 79, 82, 80, 77, 73, 69, 65],
              smooth: true,
              lineStyle: { width: 2, color: '#fb8500' },
              itemStyle: { color: '#fb8500' },
              areaStyle: { opacity: 0.15, color: '#fb8500' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'Disk I/O',
              type: 'line',
              data: [12, 15, 18, 22, 28, 35, 42, 48, 52, 55, 57, 54, 50, 45, 40, 35],
              smooth: true,
              lineStyle: { width: 2, color: '#cf222e', type: 'dashed' },
              itemStyle: { color: '#cf222e' },
              emphasis: { focus: 'series' }
            }
          ],
          dataZoom: [
            { type: 'inside', start: 0, end: 100 },
            { start: 0, end: 100, height: 20, bottom: 45 }
          ]
        };

      case 'fault-injection':
        return {
          title: {
            text: 'Fault Injection & Recovery Analysis',
            subtext: 'System Resilience & Graceful Degradation Testing',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: '700', color: '#24292f' },
            subtextStyle: { fontSize: 13, color: '#57606a' }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            formatter: (params) => {
              let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
              params.forEach(item => {
                if (item.value !== null && item.value !== undefined) {
                  const health = item.value >= 95 ? 'Healthy' : item.value >= 80 ? 'Degraded' : item.value >= 60 ? 'Impaired' : 'Critical';
                  const healthColor = item.value >= 95 ? '#1f883d' : item.value >= 80 ? '#fb8500' : item.value >= 60 ? '#cf222e' : '#8b0000';
                  result += `<div style="margin: 4px 0;">
                    <div><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 6px;"></span>${item.seriesName}: <span style="font-weight: 700;">${item.value}%</span></div>
                    <div style="font-size: 11px; color: ${healthColor}; margin-left: 16px;">${health}</div>
                  </div>`;
                }
              });
              return result;
            }
          },
          legend: {
            data: ['Normal Operation', 'Gateway Failure', 'Sensor Failure', 'Recovery Mode', 'Safety Fallback'],
            bottom: 15,
            itemGap: 18,
            textStyle: { fontSize: 12, color: '#24292f' }
          },
          grid: { left: '3%', right: '4%', bottom: '15%', top: '18%', containLabel: true },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            axisLabel: { fontSize: 11, color: '#57606a' },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          yAxis: {
            type: 'value',
            name: 'System Health (%)',
            min: 0,
            max: 100,
            nameTextStyle: { fontSize: 12, color: '#24292f', padding: [0, 0, 0, 10] },
            axisLabel: { fontSize: 11, color: '#57606a', formatter: '{value}%' },
            splitLine: { lineStyle: { color: '#eaecef', type: 'dashed' } },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          },
          series: [
            {
              name: 'Normal Operation',
              type: 'line',
              data: [98, 97, 98, 99, 98, 97, null, null, null, null, null, null, null],
              smooth: true,
              lineStyle: { width: 3, color: '#1f883d' },
              itemStyle: { color: '#1f883d' },
              areaStyle: { opacity: 0.2, color: '#1f883d' },
              emphasis: { focus: 'series' },
              markArea: {
                silent: true,
                itemStyle: { color: 'rgba(31, 136, 61, 0.1)' },
                data: [[{ xAxis: 'T0' }, { xAxis: 'T5' }]],
                label: { show: true, position: 'top', formatter: 'Normal Phase', fontSize: 11, color: '#1f883d' }
              }
            },
            {
              name: 'Gateway Failure',
              type: 'line',
              data: [null, null, null, null, null, 97, 42, 38, 35, null, null, null, null],
              smooth: true,
              lineStyle: { width: 3, color: '#cf222e', type: 'solid' },
              itemStyle: { color: '#cf222e' },
              areaStyle: { opacity: 0.25, color: '#cf222e' },
              emphasis: { focus: 'series' },
              markPoint: {
                data: [{ coord: ['T6', 42], name: 'Fault Injected', value: 'Fault\nInjected', itemStyle: { color: '#cf222e' } }]
              },
              markArea: {
                silent: true,
                itemStyle: { color: 'rgba(207, 34, 46, 0.1)' },
                data: [[{ xAxis: 'T6' }, { xAxis: 'T8' }]],
                label: { show: true, position: 'top', formatter: 'Fault Active', fontSize: 11, color: '#cf222e' }
              }
            },
            {
              name: 'Sensor Failure',
              type: 'line',
              data: [null, null, null, null, null, null, null, null, 35, 58, 62, null, null],
              smooth: true,
              lineStyle: { width: 2.5, color: '#fb8500' },
              itemStyle: { color: '#fb8500' },
              areaStyle: { opacity: 0.2, color: '#fb8500' },
              emphasis: { focus: 'series' }
            },
            {
              name: 'Recovery Mode',
              type: 'line',
              data: [null, null, null, null, null, null, null, null, null, 62, 75, 85, 92],
              smooth: true,
              lineStyle: { width: 3, color: '#0969da' },
              itemStyle: { color: '#0969da' },
              areaStyle: { opacity: 0.2, color: '#0969da' },
              emphasis: { focus: 'series' },
              markArea: {
                silent: true,
                itemStyle: { color: 'rgba(9, 105, 218, 0.1)' },
                data: [[{ xAxis: 'T9' }, { xAxis: 'T12' }]],
                label: { show: true, position: 'top', formatter: 'Recovery Phase', fontSize: 11, color: '#0969da' }
              }
            },
            {
              name: 'Safety Fallback',
              type: 'line',
              data: [null, null, null, null, null, null, 60, 60, 60, 60, 60, null, null],
              smooth: false,
              step: 'middle',
              lineStyle: { width: 2, color: '#8250df', type: 'dashed' },
              itemStyle: { color: '#8250df' },
              emphasis: { focus: 'series' },
              markLine: {
                silent: true,
                lineStyle: { color: '#8250df', type: 'dashed', width: 1.5, opacity: 0.5 },
                label: { formatter: 'Safety Mode', position: 'middle', color: '#8250df', fontSize: 11 },
                data: [{ yAxis: 60 }]
              }
            }
          ]
        };

      case 'report':
        return {
          title: {
            text: 'Comprehensive Performance Assessment',
            subtext: 'Multi-Dimensional System Evaluation Matrix',
            left: 'center',
            textStyle: { fontSize: 18, fontWeight: '700', color: '#24292f' },
            subtextStyle: { fontSize: 13, color: '#57606a' }
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              if (params.componentType === 'radar') {
                let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params.seriesName} - ${params.name}</div>`;
                params.value.forEach((val, idx) => {
                  const indicators = ['Throughput', 'Latency', 'Reliability', 'Scalability', 'Efficiency', 'Security'];
                  const grade = val >= 90 ? 'Excellent' : val >= 80 ? 'Good' : val >= 70 ? 'Fair' : 'Poor';
                  const gradeColor = val >= 90 ? '#1f883d' : val >= 80 ? '#0969da' : val >= 70 ? '#fb8500' : '#cf222e';
                  result += `<div style="margin: 4px 0; display: flex; justify-content: space-between;">
                    <span>${indicators[idx]}</span>
                    <span style="margin-left: 20px;"><span style="font-weight: 700;">${val}</span> <span style="font-size: 11px; color: ${gradeColor};">(${grade})</span></span>
                  </div>`;
                });
                return result;
              }
              return params.name + ': ' + params.value;
            }
          },
          legend: [
            {
              data: ['Current Design', 'Baseline', 'Target'],
              bottom: '8%',
              left: 'center',
              itemGap: 30,
              textStyle: { fontSize: 13, color: '#24292f', fontWeight: '500' }
            },
            {
              data: ['ADAS', 'Body', 'Powertrain', 'Chassis', 'Infotainment'],
              top: '55%',
              left: 'center',
              itemGap: 20,
              textStyle: { fontSize: 12, color: '#24292f' }
            }
          ],
          radar: [
            {
              indicator: [
                { name: 'Throughput', max: 100, axisLabel: { show: true, fontSize: 11, color: '#57606a' } },
                { name: 'Latency', max: 100, axisLabel: { show: true, fontSize: 11, color: '#57606a' } },
                { name: 'Reliability', max: 100, axisLabel: { show: true, fontSize: 11, color: '#57606a' } },
                { name: 'Scalability', max: 100, axisLabel: { show: true, fontSize: 11, color: '#57606a' } },
                { name: 'Efficiency', max: 100, axisLabel: { show: true, fontSize: 11, color: '#57606a' } },
                { name: 'Security', max: 100, axisLabel: { show: true, fontSize: 11, color: '#57606a' } }
              ],
              center: ['50%', '25%'],
              radius: '35%',
              shape: 'polygon',
              splitNumber: 5,
              name: {
                textStyle: { fontSize: 13, color: '#24292f', fontWeight: '600' }
              },
              splitLine: { lineStyle: { color: '#d0d7de' } },
              splitArea: {
                show: true,
                areaStyle: {
                  color: ['rgba(246, 248, 250, 0.5)', 'rgba(246, 248, 250, 0.8)']
                }
              },
              axisLine: { lineStyle: { color: '#d0d7de' } }
            }
          ],
          series: [
            {
              name: 'Performance Metrics',
              type: 'radar',
              radarIndex: 0,
              emphasis: { focus: 'series', lineStyle: { width: 4 } },
              data: [
                {
                  value: [92, 85, 96, 88, 91, 87],
                  name: 'Current Design',
                  areaStyle: { color: 'rgba(9, 105, 218, 0.25)' },
                  lineStyle: { width: 3, color: '#0969da' },
                  itemStyle: { color: '#0969da', borderWidth: 2 },
                  label: { show: false }
                },
                {
                  value: [72, 68, 75, 70, 73, 71],
                  name: 'Baseline',
                  areaStyle: { color: 'rgba(150, 206, 180, 0.2)' },
                  lineStyle: { width: 2, color: '#96ceb4', type: 'dashed' },
                  itemStyle: { color: '#96ceb4' },
                  label: { show: false }
                },
                {
                  value: [95, 90, 98, 92, 94, 90],
                  name: 'Target',
                  lineStyle: { width: 2, color: '#1f883d', type: 'dotted' },
                  itemStyle: { color: '#1f883d', symbol: 'diamond' },
                  label: { show: false }
                }
              ]
            },
            {
              name: 'Domain Performance',
              type: 'bar',
              barWidth: '45%',
              itemStyle: {
                borderRadius: [4, 4, 0, 0],
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
              },
              label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                fontSize: 11,
                fontWeight: '600',
                color: '#24292f'
              },
              emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' }
              },
              data: [
                { value: 94, itemStyle: { color: '#0969da' }, name: 'ADAS' },
                { value: 88, itemStyle: { color: '#1f883d' }, name: 'Body' },
                { value: 85, itemStyle: { color: '#8250df' }, name: 'Powertrain' },
                { value: 82, itemStyle: { color: '#fb8500' }, name: 'Chassis' },
                { value: 79, itemStyle: { color: '#cf222e' }, name: 'Infotainment' }
              ]
            }
          ],
          grid: {
            left: '8%',
            right: '8%',
            bottom: '22%',
            top: '55%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['ADAS', 'Body', 'Powertrain', 'Chassis', 'Infotainment'],
            axisLabel: { fontSize: 12, color: '#24292f', fontWeight: '500', interval: 0 },
            axisLine: { lineStyle: { color: '#d0d7de' } },
            axisTick: { show: false }
          },
          yAxis: {
            type: 'value',
            name: 'Overall Score',
            max: 100,
            nameTextStyle: { fontSize: 12, color: '#24292f', fontWeight: '600', padding: [0, 0, 0, 10] },
            axisLabel: { fontSize: 11, color: '#57606a', formatter: '{value}%' },
            splitLine: { lineStyle: { color: '#eaecef', type: 'dashed' } },
            axisLine: { lineStyle: { color: '#d0d7de' } }
          }
        };

      default:
        return {};
    }
  };

  const getSimulationTitle = () => {
    const titles = {
      'network-sim': '网络通信仿真',
      'bandwidth-analysis': '带宽使用分析',
      'latency-test': '延迟测试',
      'load-test': '负载测试',
      'fault-injection': '故障注入测试',
      'report': '仿真性能报告',
    };
    return titles[simulationType] || '仿真面板';
  };

  if (embedded) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #d0d7de',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#24292f' }}>
            {getSimulationTitle()}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              background: '#0969da',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            返回编辑器
          </button>
        </div>

        {/* Chart */}
        <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <ReactECharts option={getChartOption()} style={{ height: '100%', minHeight: '500px' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          width: '900px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 8px 24px rgba(27,31,35,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #d0d7de',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#24292f' }}>
            {getSimulationTitle()}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#57606a',
              padding: '0 8px',
            }}
          >
            ×
          </button>
        </div>

        {/* Chart */}
        <div style={{ padding: '24px' }}>
          <ReactECharts option={getChartOption()} style={{ height: '500px' }} />
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #d0d7de', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: '#0969da',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;
