import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ServiceNode = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #a044ff 0%, #6a3093 100%)',
        border: selected ? '2px dashed #ffd700' : '2px dashed #8e44ad',
        color: 'white',
        minWidth: '170px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#8e44ad', borderRadius: '50%' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
        ☁️ {data.label}
      </div>
      
      <div style={{ fontSize: '10px', opacity: 0.9 }}>
        {data.serviceType && <div>Type: {data.serviceType}</div>}
        {data.protocol && <div>Protocol: {data.protocol}</div>}
        {data.interface && <div>Interface: {data.interface}</div>}
        {data.qos && <div>QoS: {data.qos}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#8e44ad', borderRadius: '50%' }} />
    </div>
  );
};

export default memo(ServiceNode);
