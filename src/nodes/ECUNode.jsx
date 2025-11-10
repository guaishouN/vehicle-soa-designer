import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ECUNode = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: selected ? '2px solid #ffd700' : '2px solid #5a67d8',
        color: 'white',
        minWidth: '180px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
        📟 {data.label}
      </div>
      
      <div style={{ fontSize: '11px', opacity: 0.9 }}>
        <div>HW: {data.hwId}</div>
        <div>SW: {data.swVersion}</div>
        {data.powerMode && <div>Power: {data.powerMode}</div>}
        {data.canMessages && (
          <div style={{ marginTop: '4px', fontSize: '10px' }}>
            Messages: {data.canMessages.length}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

export default memo(ECUNode);
