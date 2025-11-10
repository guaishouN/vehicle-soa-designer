import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const SwitchNode = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
        border: selected ? '2px solid #ffd700' : '2px solid #2c3e50',
        color: 'white',
        minWidth: '180px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#2c3e50' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#2c3e50' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
        🔀 {data.label}
      </div>
      
      <div style={{ fontSize: '11px', opacity: 0.9 }}>
        <div>HW: {data.hwId}</div>
        {data.swVersion && <div>SW: {data.swVersion}</div>}
        {data.portCount && <div>Ports: {data.portCount}</div>}
        {data.vlanSupport && <div>✓ VLAN Support</div>}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#2c3e50' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#2c3e50' }} />
    </div>
  );
};

export default memo(SwitchNode);
