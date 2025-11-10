import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const GatewayNode = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: '14px 18px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
        border: selected ? '3px solid #ffd700' : '2px solid #e63946',
        color: 'white',
        minWidth: '200px',
        boxShadow: selected ? '0 6px 16px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#333', width: '12px', height: '12px' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#333', width: '10px', height: '10px' }} />
      <Handle type="target" position={Position.Right} style={{ background: '#333', width: '10px', height: '10px' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '6px', textAlign: 'center' }}>
        🌐 {data.label}
      </div>
      
      <div style={{ fontSize: '11px', opacity: 0.95 }}>
        <div>HW: {data.hwId}</div>
        <div>SW: {data.swVersion}</div>
        {data.bandwidth && <div>Bandwidth: {data.bandwidth}</div>}
        {data.redundancy && <div>✓ Redundancy Enabled</div>}
        {data.ports && (
          <div style={{ marginTop: '6px', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Ports:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
              {data.ports.map((port, idx) => (
                <span key={idx} style={{ background: 'rgba(255,255,255,0.3)', padding: '2px 6px', borderRadius: '3px' }}>
                  {port}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#333', width: '12px', height: '12px' }} />
      <Handle type="source" position={Position.Left} id="left-out" style={{ background: '#333', width: '10px', height: '10px', top: '70%' }} />
      <Handle type="source" position={Position.Right} id="right-out" style={{ background: '#333', width: '10px', height: '10px', top: '70%' }} />
    </div>
  );
};

export default memo(GatewayNode);
