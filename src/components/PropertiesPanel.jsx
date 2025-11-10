import { useState } from 'react';

const PropertiesPanel = ({ selectedNode, selectedEdge, nodes, edges, onUpdateNode, onUpdateEdge, onDeleteNode, onDeleteEdge }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { key: 'basic', label: '基本信息', icon: '📋' },
    { key: 'network', label: '网络属性', icon: '🔗' },
    { key: 'function', label: '功能接口', icon: '🔌' },
    { key: 'software', label: '软件配置', icon: '💻' },
    { key: 'electrical', label: '电气属性', icon: '⚡' },
    { key: 'validation', label: '校验结果', icon: '✓' },
  ];

  if (!selectedNode && !selectedEdge) {
    return (
      <div style={{
        width: '380px',
        background: '#ffffff',
        borderLeft: '1px solid #d0d7de',
        padding: '20px',
        overflow: 'auto',
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#24292f', fontWeight: '600' }}>属性面板</h3>
        <div style={{ padding: '40px 20px', color: '#57606a' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>👈</div>
          <p style={{ textAlign: 'center' }}>选择节点或连接</p>
          <p style={{ fontSize: '12px', textAlign: 'center' }}>查看和编辑属性</p>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#24292f', fontWeight: '600' }}>📊 统计信息</h4>
          <div style={{ background: '#f6f8fa', padding: '16px', borderRadius: '6px', border: '1px solid #d0d7de' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#57606a' }}>总节点数</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#24292f' }}>{nodes?.length || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#8b949e' }}>总连接数</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#24292f' }}>{edges?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '380px',
      background: '#ffffff',
      borderLeft: '1px solid #d0d7de',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #d0d7de',
        background: '#f6f8fa',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#24292f' }}>
            {selectedNode ? `${selectedNode.data.label}` : '连接属性'}
          </h3>
          <button
            onClick={() => selectedNode ? onDeleteNode?.() : onDeleteEdge?.()}
            style={{
              background: '#cf222e',
              color: 'white',
              border: '1px solid #a40e26',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            🗑️ 删除
          </button>
        </div>
        <div style={{ fontSize: '12px', color: '#57606a', marginTop: '4px', fontFamily: 'monospace' }}>
          {selectedNode ? selectedNode.type : 'Edge'}
        </div>
      </div>

      {/* Tabs */}
      {selectedNode && (
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          borderBottom: '1px solid #d0d7de',
          background: '#f6f8fa',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 14px',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab.key ? '#cf222e' : '#57606a',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: activeTab === tab.key ? '600' : '400',
                whiteSpace: 'nowrap',
                borderBottom: activeTab === tab.key ? '2px solid #fd8c73' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px', background: '#ffffff' }}>
        {selectedNode && activeTab === 'basic' && (
          <div>
            <FormField 
              label="名称" 
              value={selectedNode.data.label} 
              onChange={(v) => onUpdateNode?.({ label: v })} 
            />
            <FormField 
              label="硬件 ID" 
              value={selectedNode.data.hwId || ''} 
              onChange={(v) => onUpdateNode?.({ hwId: v })} 
            />
            <FormField 
              label="软件版本" 
              value={selectedNode.data.swVersion || ''} 
              onChange={(v) => onUpdateNode?.({ swVersion: v })} 
            />
            {selectedNode.data.domain !== undefined && (
              <FormField 
                label="域" 
                value={selectedNode.data.domain} 
                onChange={(v) => onUpdateNode?.({ domain: v })} 
              />
            )}
            <FormField 
              label="描述" 
              value={selectedNode.data.description || ''} 
              onChange={(v) => onUpdateNode?.({ description: v })} 
              multiline 
            />
          </div>
        )}

        {selectedNode && activeTab === 'network' && (
          <div>
            {selectedNode.data.ports !== undefined && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#24292f' }}>
                  端口列表
                </label>
                <div style={{ background: '#f6f8fa', padding: '12px', borderRadius: '6px', border: '1px solid #d0d7de' }}>
                  {(selectedNode.data.ports || []).map((port, idx) => (
                    <div key={idx} style={{ 
                      padding: '8px', 
                      background: '#f6f8fa', 
                      borderRadius: '4px', 
                      marginBottom: '6px',
                      fontSize: '12px',
                      color: '#24292f',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}>
                      <input
                        value={port}
                        onChange={(e) => {
                          const newPorts = [...(selectedNode.data.ports || [])];
                          newPorts[idx] = e.target.value;
                          onUpdateNode?.({ ports: newPorts });
                        }}
                        style={{
                          flex: 1,
                          padding: '4px 8px',
                          border: '1px solid #d0d7de',
                          borderRadius: '4px',
                          background: '#ffffff',
                          fontSize: '12px',
                        }}
                      />
                      <button
                        onClick={() => {
                          const newPorts = selectedNode.data.ports.filter((_, i) => i !== idx);
                          onUpdateNode?.({ ports: newPorts });
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#cf222e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newPorts = [...(selectedNode.data.ports || []), `Port${(selectedNode.data.ports?.length || 0) + 1}`];
                      onUpdateNode?.({ ports: newPorts });
                    }}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: '#1a7f37',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      width: '100%',
                    }}
                  >
                    + 添加端口
                  </button>
                </div>
              </div>
            )}
            {selectedNode.data.bandwidth !== undefined && (
              <FormField 
                label="带宽" 
                value={selectedNode.data.bandwidth} 
                onChange={(v) => onUpdateNode?.({ bandwidth: v })} 
              />
            )}
            {selectedNode.data.latency !== undefined && (
              <FormField 
                label="延迟要求" 
                value={selectedNode.data.latency} 
                onChange={(v) => onUpdateNode?.({ latency: v })} 
              />
            )}
          </div>
        )}

        {selectedNode && activeTab === 'function' && (
          <div>
            {selectedNode.data.services !== undefined && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#24292f' }}>
                  提供的服务
                </label>
                <div style={{ background: '#f6f8fa', padding: '12px', borderRadius: '6px', border: '1px solid #d0d7de' }}>
                  {(selectedNode.data.services || []).map((service, idx) => (
                    <div key={idx} style={{ 
                      padding: '8px', 
                      background: '#2f3136', 
                      borderRadius: '4px', 
                      marginBottom: '6px',
                      fontSize: '12px',
                      color: '#24292f',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '14px' }}>☁️</span>
                      <input
                        value={service}
                        onChange={(e) => {
                          const newServices = [...(selectedNode.data.services || [])];
                          newServices[idx] = e.target.value;
                          onUpdateNode?.({ services: newServices });
                        }}
                        style={{
                          flex: 1,
                          padding: '4px 8px',
                          border: '1px solid #d0d7de',
                          borderRadius: '4px',
                          background: '#ffffff',
                          fontSize: '12px',
                        }}
                      />
                      <button
                        onClick={() => {
                          const newServices = selectedNode.data.services.filter((_, i) => i !== idx);
                          onUpdateNode?.({ services: newServices });
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#cf222e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newServices = [...(selectedNode.data.services || []), 'New Service'];
                      onUpdateNode?.({ services: newServices });
                    }}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: '#1a7f37',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      width: '100%',
                    }}
                  >
                    + 添加服务
                  </button>
                </div>
              </div>
            )}
            {selectedNode.data.interface !== undefined && (
              <FormField 
                label="接口" 
                value={selectedNode.data.interface} 
                onChange={(v) => onUpdateNode?.({ interface: v })} 
              />
            )}
          </div>
        )}

        {selectedNode && activeTab === 'software' && (
          <div>
            {selectedNode.data.cpu !== undefined && (
              <FormField 
                label="CPU" 
                value={selectedNode.data.cpu} 
                onChange={(v) => onUpdateNode?.({ cpu: v })} 
              />
            )}
            {selectedNode.data.memory !== undefined && (
              <FormField 
                label="内存" 
                value={selectedNode.data.memory} 
                onChange={(v) => onUpdateNode?.({ memory: v })} 
              />
            )}
            <FormField 
              label="软件版本" 
              value={selectedNode.data.swVersion || ''} 
              onChange={(v) => onUpdateNode?.({ swVersion: v })} 
            />
          </div>
        )}

        {selectedNode && activeTab === 'electrical' && (
          <div>
            {selectedNode.data.powerMode !== undefined && (
              <FormField 
                label="电源模式" 
                value={selectedNode.data.powerMode} 
                onChange={(v) => onUpdateNode?.({ powerMode: v })} 
              />
            )}
            {selectedNode.data.redundancy !== undefined && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#24292f' }}>
                  冗余
                </label>
                <div style={{ 
                  padding: '10px', 
                  background: selectedNode.data.redundancy ? '#dafbe1' : '#fff8c5',
                  borderRadius: '6px',
                  fontSize: '13px',
                  border: '1px solid #d0d7de',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <input
                    type="checkbox"
                    checked={selectedNode.data.redundancy}
                    onChange={(e) => onUpdateNode?.({ redundancy: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>{selectedNode.data.redundancy ? '✓ 启用冗余' : '⚠ 未启用冗余'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedNode && activeTab === 'validation' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#57606a' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <p>暂无校验问题</p>
          </div>
        )}

        {selectedEdge && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#24292f' }}>
                总线类型
              </label>
              <select
                value={selectedEdge.data?.busType || 'CAN'}
                onChange={(e) => onUpdateEdge?.({ busType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d0d7de',
                  fontSize: '13px',
                  background: '#f6f8fa',
                  color: '#24292f',
                }}
              >
                <option value="CAN">CAN</option>
                <option value="CAN-FD">CAN-FD</option>
                <option value="LIN">LIN</option>
                <option value="Ethernet">Ethernet</option>
                <option value="FlexRay">FlexRay</option>
                <option value="Virtual/Service">Virtual/Service</option>
              </select>
            </div>
            <FormField 
              label="带宽" 
              value={selectedEdge.data?.bandwidth || ''} 
              onChange={(v) => onUpdateEdge?.({ bandwidth: v })} 
            />
            <FormField 
              label="延迟" 
              value={selectedEdge.data?.latency || ''} 
              onChange={(v) => onUpdateEdge?.({ latency: v })} 
            />
          </div>
        )}

        {/* Metadata Preview */}
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#57606a' }}>
            完整元数据
          </h4>
          <div style={{
            background: '#f6f8fa',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #d0d7de',
          }}>
            {Object.entries(selectedNode?.data || selectedEdge?.data || {}).map(([key, value]) => (
              <div key={key} style={{ 
                marginBottom: '8px', 
                paddingBottom: '8px', 
                borderBottom: '1px solid #d0d7de',
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  color: '#57606a',
                  marginBottom: '4px',
                  fontFamily: 'monospace',
                }}>
                  {key}
                </div>
                <div style={{ fontSize: '12px' }}>
                  {Array.isArray(value) ? (
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {value.map((item, idx) => (
                          <span key={idx} style={{
                            background: '#ffffff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #d0d7de',
                            fontSize: '11px',
                            color: '#24292f',
                          }}>
                            {String(item)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : typeof value === 'object' && value !== null ? (
                    <textarea
                      value={JSON.stringify(value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          if (selectedNode) {
                            onUpdateNode?.({ [key]: parsed });
                          } else {
                            onUpdateEdge?.({ [key]: parsed });
                          }
                        } catch (err) {
                          // Invalid JSON, don't update
                        }
                      }}
                      style={{ 
                        width: '100%',
                        minHeight: '60px',
                        padding: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        border: '1px solid #d0d7de',
                        borderRadius: '4px',
                        background: '#ffffff',
                        color: '#24292f',
                        resize: 'vertical',
                      }}
                    />
                  ) : typeof value === 'boolean' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          if (selectedNode) {
                            onUpdateNode?.({ [key]: e.target.checked });
                          } else {
                            onUpdateEdge?.({ [key]: e.target.checked });
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ 
                        color: value ? '#1a7f37' : '#cf222e',
                        fontWeight: '600',
                      }}>
                        {value ? '✓ true' : '✗ false'}
                      </span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={String(value)}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // Try to parse as number if it looks like one
                        const parsedValue = !isNaN(newValue) && newValue !== '' ? Number(newValue) : newValue;
                        if (selectedNode) {
                          onUpdateNode?.({ [key]: parsedValue });
                        } else {
                          onUpdateEdge?.({ [key]: parsedValue });
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        fontSize: '12px',
                        border: '1px solid #d0d7de',
                        borderRadius: '4px',
                        background: '#ffffff',
                        color: '#24292f',
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, value, onChange, disabled, multiline }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#57606a' }}>
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={3}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid #d0d7de',
          fontSize: '13px',
          background: disabled ? '#f6f8fa' : '#ffffff',
          color: '#24292f',
          resize: 'vertical',
        }}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid #d0d7de',
          fontSize: '13px',
          background: disabled ? '#f6f8fa' : '#ffffff',
          color: '#24292f',
        }}
      />
    )}
  </div>
);

export default PropertiesPanel;
