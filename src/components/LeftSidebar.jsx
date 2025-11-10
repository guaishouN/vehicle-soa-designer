import { useState } from 'react';

const LeftSidebar = ({ onAddNode, selectedNodeType, onSelectNodeType, onLoadTemplate, disabled, onSimulationChange }) => {
  const [activeTab, setActiveTab] = useState('nodes');
  const [collapsed, setCollapsed] = useState(false);

  const nodeCategories = {
    structure: {
      label: 'Structure',
      items: [
        { type: 'ecu', label: 'ECU', description: '电子控制单元' },
        { type: 'domainController', label: '域控制器', description: 'Domain Controller' },
        { type: 'gateway', label: '网关', description: 'Gateway' },
        { type: 'sensor', label: '传感器', description: 'Sensor' },
        { type: 'actuator', label: '执行器', description: 'Actuator' },
        { type: 'switch', label: '交换机', description: 'Switch' },
      ],
    },
    network: {
      label: 'Network',
      items: [
        { type: 'CAN', label: 'CAN', description: '500kbps-1Mbps' },
        { type: 'CAN-FD', label: 'CAN-FD', description: 'up to 8Mbps' },
        { type: 'Ethernet', label: 'Ethernet', description: 'up to 1Gbps' },
        { type: 'FlexRay', label: 'FlexRay', description: '10Mbps' },
        { type: 'LIN', label: 'LIN', description: '20kbps' },
      ],
    },
    software: {
      label: 'Software',
      items: [
        { type: 'service', label: 'SOME/IP 服务', description: 'Service' },
        { type: 'interface', label: '接口', description: 'Interface' },
        { type: 'dataflow', label: '数据流', description: 'Data Flow' },
      ],
    },
    annotation: {
      label: 'Annotation',
      items: [
        { type: 'text', label: '文字标注', description: 'Text' },
        { type: 'group', label: '分组框', description: 'Group' },
        { type: 'icon', label: '图标', description: 'Icon' },
      ],
    },
  };

  if (collapsed) {
    return (
      <div style={{
        width: '48px',
        background: '#f6f8fa',
        borderRight: '1px solid #d0d7de',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
      }}>
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '8px',
            color: '#57606a',
          }}
        >
          ▶
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: '300px',
      background: '#ffffff',
      borderRight: '1px solid #d0d7de',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #d0d7de',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #ffffff 0%, #f6f8fa 100%)',
      }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#24292f', letterSpacing: '-0.2px' }}>组件面板</h3>
        <button
          onClick={() => setCollapsed(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px',
            color: '#57606a',
          }}
        >
          ◀
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #d0d7de',
        background: '#ffffff',
      }}>
        <button
          onClick={() => {
            setActiveTab('nodes');
            onSimulationChange?.('editor');
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'nodes' ? '2px solid #0969da' : '2px solid transparent',
            background: 'transparent',
            color: activeTab === 'nodes' ? '#0969da' : '#57606a',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activeTab === 'nodes' ? '600' : '500',
            transition: 'all 0.2s',
          }}
        >
          节点库
        </button>
        <button
          onClick={() => {
            setActiveTab('templates');
            onSimulationChange?.('editor');
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'templates' ? '2px solid #0969da' : '2px solid transparent',
            background: 'transparent',
            color: activeTab === 'templates' ? '#0969da' : '#57606a',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activeTab === 'templates' ? '600' : '500',
            transition: 'all 0.2s',
          }}
        >
          模板
        </button>
        <button
          onClick={() => {
            setActiveTab('simulation');
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'simulation' ? '2px solid #0969da' : '2px solid transparent',
            background: 'transparent',
            color: activeTab === 'simulation' ? '#0969da' : '#57606a',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activeTab === 'simulation' ? '600' : '500',
            transition: 'all 0.2s',
          }}
        >
          仿真
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 12px' }}>
        {activeTab === 'nodes' && (
          <>
            {Object.entries(nodeCategories).map(([key, category]) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  color: '#656d76', 
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}>
                  {category.label}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {category.items.map((item) => (
                    <div
                      key={item.type}
                      onClick={() => {
                        onSelectNodeType?.(item.type);
                        if (key === 'structure' || key === 'software') {
                          onAddNode?.(item.type);
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        background: selectedNodeType === item.type ? '#e8f1ff' : '#ffffff',
                        border: selectedNodeType === item.type ? '1px solid #0969da' : '1px solid #d0d7de',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedNodeType !== item.type) {
                          e.currentTarget.style.background = '#f6f8fa';
                          e.currentTarget.style.borderColor = '#0969da';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedNodeType !== item.type) {
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.borderColor = '#d0d7de';
                        }
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#24292f', letterSpacing: '-0.1px', lineHeight: '1.3' }}>{item.label}</div>
                        <div style={{ fontSize: '11px', color: '#656d76', marginTop: '2px', lineHeight: '1.3' }}>{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'templates' && (
          <div>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#656d76', 
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}>
              Templates
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                {
                  id: 'basic-adas',
                  name: 'ADAS 基础架构',
                  description: '域控制器 + 传感器',
                  category: 'ADAS',
                  nodeCount: 5,
                },
                {
                  id: 'full-vehicle',
                  name: '全车架构',
                  description: '五域架构 + 网关',
                  category: 'FULL',
                  nodeCount: 12,
                },
                {
                  id: 'network-topology',
                  name: '网络拓扑',
                  description: 'Ethernet + CAN-FD',
                  category: 'NET',
                  nodeCount: 8,
                },
                {
                  id: 'soa-services',
                  name: 'SOA 服务架构',
                  description: 'SOME/IP 服务模型',
                  category: 'SOA',
                  nodeCount: 10,
                },
                {
                  id: 'body-domain',
                  name: '车身域架构',
                  description: 'BCM + 车身控制',
                  category: 'BODY',
                  nodeCount: 7,
                },
                {
                  id: 'powertrain',
                  name: '动力域架构',
                  description: 'VCU + BMS + MCU',
                  category: 'PWR',
                  nodeCount: 6,
                },
              ].map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    onLoadTemplate?.(template.id);
                    onSimulationChange?.('editor');
                  }}
                  style={{
                    padding: '12px 14px',
                    background: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f6f8fa';
                    e.currentTarget.style.borderColor = '#0969da';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d0d7de';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#24292f',
                        marginBottom: '3px',
                        letterSpacing: '-0.1px',
                      }}>
                        {template.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#656d76', marginBottom: '8px' }}>
                        {template.description}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#0969da',
                          background: '#ddf4ff',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          display: 'inline-block',
                          fontWeight: '600',
                          border: '1px solid #54aeff66',
                        }}>
                          {template.category}
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#656d76',
                        }}>
                          {template.nodeCount} 个节点
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '18px', 
                      color: '#57606a',
                      opacity: 0.5,
                    }}>
                      ›
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#656d76', 
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}>
              Simulation Tools
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'network-sim', name: '网络仿真', description: '模拟网络通信', icon: '🔌' },
                { id: 'bandwidth-analysis', name: '带宽分析', description: '分析网络带宽使用', icon: '📊' },
                { id: 'latency-test', name: '延迟测试', description: '测量通信延迟', icon: '⏱️' },
                { id: 'load-test', name: '负载测试', description: '模拟高负载场景', icon: '⚡' },
                { id: 'fault-injection', name: '故障注入', description: '模拟故障场景', icon: '⚠️' },
                { id: 'report', name: '仿真报告', description: '生成仿真结果', icon: '📝' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSimulationChange?.(item.id)}
                  style={{
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #d0d7de',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f6f8fa';
                    e.currentTarget.style.borderColor = '#0969da';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d0d7de';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#24292f', letterSpacing: '-0.1px', lineHeight: '1.3' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#656d76', marginTop: '2px', lineHeight: '1.3' }}>{item.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #d0d7de',
        background: '#f6f8fa',
      }}>
        <button
          onClick={() => onAddNode?.(selectedNodeType)}
          disabled={!selectedNodeType}
          style={{
            width: '100%',
            padding: '10px',
            background: selectedNodeType ? '#1a7f37' : '#f6f8fa',
            color: selectedNodeType ? 'white' : '#57606a',
            border: selectedNodeType ? '1px solid #1a7f37' : '1px solid #d0d7de',
            borderRadius: '6px',
            cursor: selectedNodeType ? 'pointer' : 'not-allowed',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (selectedNodeType) {
              e.currentTarget.style.background = '#2da44e';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedNodeType) {
              e.currentTarget.style.background = '#1a7f37';
            }
          }}
        >
          添加到画布
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
