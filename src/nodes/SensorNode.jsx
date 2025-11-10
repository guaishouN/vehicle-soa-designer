import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const SensorNode = ({ data, selected }) => {
  const sensorIcons = {
    Camera: '📷',
    Radar: '📡',
    LiDAR: '🔦',
    Ultrasonic: '🔊',
    GPS: '🛰️',
    IMU: '⚖️',
  };

  const icon = sensorIcons[data.sensorType] || '📊';

  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        border: selected ? '2px solid #ffd700' : '2px solid #0d7377',
        color: 'white',
        minWidth: '160px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#0d7377' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
        {icon} {data.label}
      </div>
      
      <div style={{ fontSize: '10px', opacity: 0.9 }}>
        <div style={{ fontWeight: 'bold' }}>Type: {data.sensorType}</div>
        <div>HW: {data.hwId}</div>
        {data.resolution && <div>Resolution: {data.resolution}</div>}
        {data.frameRate && <div>Frame Rate: {data.frameRate}</div>}
        {data.bandwidth && <div>Bandwidth: {data.bandwidth}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#0d7377' }} />
    </div>
  );
};

export default memo(SensorNode);
