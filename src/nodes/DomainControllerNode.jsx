import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const domainColors = {
  ADAS: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
  Body: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  Powertrain: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  Chassis: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  Infotainment: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  Network: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
};

const DomainControllerNode = ({ data, selected }) => {
  const gradient = domainColors[data.domain] || domainColors.ADAS;
  
  return (
    <div
      style={{
        padding: '14px 18px',
        borderRadius: '10px',
        background: gradient,
        border: selected ? '3px solid #ffd700' : '2px solid #333',
        color: 'white',
        minWidth: '220px',
        boxShadow: selected ? '0 6px 16px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#333', width: '12px', height: '12px' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🎛️ {data.label}
      </div>
      
      <div style={{ fontSize: '11px', opacity: 0.95, lineHeight: '1.4' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Domain: {data.domain}</div>
        <div>HW: {data.hwId}</div>
        <div>SW: {data.swVersion}</div>
        {data.cpu && <div>CPU: {data.cpu}</div>}
        {data.memory && <div>Memory: {data.memory}</div>}
        {data.services && (
          <div style={{ marginTop: '6px', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Services:</div>
            {data.services.map((service, idx) => (
              <div key={idx}>• {service}</div>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#333', width: '12px', height: '12px' }} />
      <Handle type="source" position={Position.Left} style={{ background: '#333', width: '10px', height: '10px' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#333', width: '10px', height: '10px' }} />
    </div>
  );
};

export default memo(DomainControllerNode);
