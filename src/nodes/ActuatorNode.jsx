import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ActuatorNode = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
        border: selected ? '2px solid #ffd700' : '2px solid #d63031',
        color: 'white',
        minWidth: '150px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#d63031' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
        ⚙️ {data.label}
      </div>
      
      <div style={{ fontSize: '10px', opacity: 0.9 }}>
        <div>HW: {data.hwId}</div>
        {data.actuatorType && <div>Type: {data.actuatorType}</div>}
        {data.controlSignal && <div>Signal: {data.controlSignal}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#d63031' }} />
    </div>
  );
};

export default memo(ActuatorNode);
