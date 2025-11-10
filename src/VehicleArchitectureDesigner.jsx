import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import custom nodes
import ECUNode from './nodes/ECUNode';
import DomainControllerNode from './nodes/DomainControllerNode';
import SensorNode from './nodes/SensorNode';
import GatewayNode from './nodes/GatewayNode';
import ActuatorNode from './nodes/ActuatorNode';
import SwitchNode from './nodes/SwitchNode';
import ServiceNode from './nodes/ServiceNode';
import ValidationPanel from './components/ValidationPanel';
import TopNavbar from './components/TopNavbar';
import LeftSidebar from './components/LeftSidebar';
import PropertiesPanel from './components/PropertiesPanel';
import ProjectSidebar from './components/ProjectSidebar';
import SimulationPanel from './components/SimulationPanel';

// Node types registry
const nodeTypes = {
  ecu: ECUNode,
  domainController: DomainControllerNode,
  sensor: SensorNode,
  gateway: GatewayNode,
  actuator: ActuatorNode,
  switch: SwitchNode,
  service: ServiceNode,
};

// Edge types with different colors for different bus types
const edgeStyles = {
  CAN: { stroke: '#ff6b6b', strokeWidth: 2 },
  'CAN-FD': { stroke: '#ff8c42', strokeWidth: 3 },
  LIN: { stroke: '#4ecdc4', strokeWidth: 2 },
  Ethernet: { stroke: '#45b7d1', strokeWidth: 3 },
  FlexRay: { stroke: '#96ceb4', strokeWidth: 2 },
  'Virtual/Service': { stroke: '#dda15e', strokeWidth: 2, strokeDasharray: '5,5' },
};

// Initial sample nodes
const initialNodes = [
  {
    id: 'gateway-1',
    type: 'gateway',
    position: { x: 400, y: 100 },
    data: {
      label: 'Central Gateway',
      hwId: 'GW-001',
      swVersion: 'v2.3.1',
      ports: ['CAN1', 'CAN2', 'ETH1', 'ETH2'],
      bandwidth: '1Gbps',
      redundancy: true,
    },
  },
  {
    id: 'dc-adas',
    type: 'domainController',
    position: { x: 100, y: 300 },
    data: {
      label: 'ADAS Domain Controller',
      domain: 'ADAS',
      hwId: 'DC-ADAS-001',
      swVersion: 'v3.1.0',
      cpu: 'ARM Cortex-A78',
      memory: '16GB',
      services: ['Camera', 'Radar', 'LiDAR'],
    },
  },
  {
    id: 'dc-body',
    type: 'domainController',
    position: { x: 700, y: 300 },
    data: {
      label: 'Body Domain Controller',
      domain: 'Body',
      hwId: 'DC-BODY-001',
      swVersion: 'v2.0.5',
      cpu: 'ARM Cortex-R52',
      memory: '4GB',
      services: ['Lighting', 'HVAC', 'Doors'],
    },
  },
  {
    id: 'sensor-camera-1',
    type: 'sensor',
    position: { x: 50, y: 500 },
    data: {
      label: 'Front Camera',
      sensorType: 'Camera',
      hwId: 'CAM-F-001',
      resolution: '8MP',
      frameRate: '60fps',
      bandwidth: '100Mbps',
    },
  },
  {
    id: 'ecu-bcm',
    type: 'ecu',
    position: { x: 700, y: 500 },
    data: {
      label: 'BCM',
      hwId: 'BCM-001',
      swVersion: 'v1.5.2',
      canMessages: ['BCM_Status', 'BCM_Control'],
      powerMode: '12V',
    },
  },
];

// Initial sample edges
const initialEdges = [
  {
    id: 'e-gw-adas',
    source: 'gateway-1',
    target: 'dc-adas',
    type: 'smoothstep',
    label: 'Ethernet 1Gbps',
    data: { busType: 'Ethernet', bandwidth: '1Gbps', latency: '2ms' },
    style: edgeStyles.Ethernet,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e-gw-body',
    source: 'gateway-1',
    target: 'dc-body',
    type: 'smoothstep',
    label: 'CAN-FD 5Mbps',
    data: { busType: 'CAN-FD', bandwidth: '5Mbps', latency: '1ms' },
    style: edgeStyles['CAN-FD'],
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e-adas-camera',
    source: 'dc-adas',
    target: 'sensor-camera-1',
    type: 'smoothstep',
    label: 'Ethernet 100Mbps',
    data: { busType: 'Ethernet', bandwidth: '100Mbps', latency: '<10ms' },
    style: edgeStyles.Ethernet,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e-body-bcm',
    source: 'dc-body',
    target: 'ecu-bcm',
    type: 'smoothstep',
    label: 'CAN 500kbps',
    data: { busType: 'CAN', bandwidth: '500kbps', latency: '5ms' },
    style: edgeStyles.CAN,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

const VehicleArchitectureDesigner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [newNodeType, setNewNodeType] = useState('ecu');
  const [isValidationPanelOpen, setIsValidationPanelOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentView, setCurrentView] = useState('editor'); // 'editor' or simulation type

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  // Handle new connections
  const onConnect = useCallback(
    (params) => {
      const busType = 'Ethernet';
      const newEdge = {
        ...params,
        type: 'smoothstep',
        label: `${busType} 1Gbps`,
        data: { busType: busType, bandwidth: '1Gbps', latency: '2ms' },
        style: edgeStyles[busType],
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  // Handle edge selection
  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  // Handle canvas right-click
  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      type: 'canvas',
    });
  }, []);

  // Handle node right-click
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      type: 'node',
      node: node,
    });
  }, []);

  // Handle edge right-click
  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      type: 'edge',
      edge: edge,
    });
  }, []);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Add new node
  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: `New ${newNodeType}`,
        hwId: `HW-${Date.now()}`,
        swVersion: 'v1.0.0',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [newNodeType, setNodes]);

  // Export to JSON
  const exportToJSON = useCallback(() => {
    const data = {
      nodes: nodes.map(node => ({
        ...node,
        position: node.position,
      })),
      edges: edges,
      metadata: {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tool: 'Vehicle Architecture Designer',
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicle-architecture-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Import from JSON
  const importFromJSON = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.nodes) setNodes(data.nodes);
          if (data.edges) setEdges(data.edges);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges]);

  // Load template
  const loadTemplate = useCallback((templateId) => {
    const templates = {
      'basic-adas': {
        nodes: [
          {
            id: 'adas-dc',
            type: 'domainController',
            position: { x: 250, y: 150 },
            data: {
              label: 'ADAS 域控制器',
              domain: 'ADAS',
              hwId: 'DC-ADAS-001',
              swVersion: 'v3.2.0',
              cpu: 'ARM Cortex-A78',
              memory: '16GB',
              services: ['Camera', 'Radar', 'LiDAR'],
            },
          },
          {
            id: 'camera-front',
            type: 'sensor',
            position: { x: 50, y: 350 },
            data: {
              label: '前视摄像头',
              sensorType: 'Camera',
              hwId: 'CAM-F-001',
              resolution: '8MP',
              frameRate: '60fps',
              bandwidth: '100Mbps',
            },
          },
          {
            id: 'radar-front',
            type: 'sensor',
            position: { x: 250, y: 350 },
            data: {
              label: '前向雷达',
              sensorType: 'Radar',
              hwId: 'RAD-F-001',
              bandwidth: '50Mbps',
            },
          },
          {
            id: 'lidar-top',
            type: 'sensor',
            position: { x: 450, y: 350 },
            data: {
              label: '顶置LiDAR',
              sensorType: 'LiDAR',
              hwId: 'LID-T-001',
              bandwidth: '200Mbps',
            },
          },
        ],
        edges: [
          {
            id: 'e-adas-cam',
            source: 'adas-dc',
            target: 'camera-front',
            type: 'smoothstep',
            label: 'Ethernet',
            data: { busType: 'Ethernet', bandwidth: '100Mbps', latency: '<10ms' },
            style: edgeStyles.Ethernet,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          {
            id: 'e-adas-radar',
            source: 'adas-dc',
            target: 'radar-front',
            type: 'smoothstep',
            label: 'Ethernet',
            data: { busType: 'Ethernet', bandwidth: '50Mbps', latency: '<5ms' },
            style: edgeStyles.Ethernet,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          {
            id: 'e-adas-lidar',
            source: 'adas-dc',
            target: 'lidar-top',
            type: 'smoothstep',
            label: 'Ethernet',
            data: { busType: 'Ethernet', bandwidth: '200Mbps', latency: '<8ms' },
            style: edgeStyles.Ethernet,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
        ],
      },
      'full-vehicle': {
        nodes: initialNodes,
        edges: initialEdges,
      },
      'network-topology': {
        nodes: [
          {
            id: 'gw-central',
            type: 'gateway',
            position: { x: 300, y: 100 },
            data: {
              label: '中央网关',
              hwId: 'GW-001',
              swVersion: 'v2.5.0',
              ports: ['ETH1', 'ETH2', 'CAN1', 'CAN2'],
              bandwidth: '1Gbps',
              redundancy: true,
            },
          },
          {
            id: 'switch-1',
            type: 'switch',
            position: { x: 100, y: 300 },
            data: {
              label: '以太网交换机 1',
              hwId: 'SW-001',
              portCount: '8',
              vlanSupport: true,
            },
          },
          {
            id: 'switch-2',
            type: 'switch',
            position: { x: 500, y: 300 },
            data: {
              label: '以太网交换机 2',
              hwId: 'SW-002',
              portCount: '8',
              vlanSupport: true,
            },
          },
        ],
        edges: [
          {
            id: 'e-gw-sw1',
            source: 'gw-central',
            target: 'switch-1',
            type: 'smoothstep',
            label: 'Ethernet 1Gbps',
            data: { busType: 'Ethernet', bandwidth: '1Gbps', latency: '1ms' },
            style: edgeStyles.Ethernet,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          {
            id: 'e-gw-sw2',
            source: 'gw-central',
            target: 'switch-2',
            type: 'smoothstep',
            label: 'Ethernet 1Gbps',
            data: { busType: 'Ethernet', bandwidth: '1Gbps', latency: '1ms' },
            style: edgeStyles.Ethernet,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
        ],
      },
      'soa-services': {
        nodes: [
          {
            id: 'service-chassis',
            type: 'service',
            position: { x: 100, y: 100 },
            data: {
              label: '底盘服务',
              serviceType: 'SOME/IP',
              protocol: 'TCP',
              interface: 'IChassisControl',
            },
          },
          {
            id: 'service-body',
            type: 'service',
            position: { x: 300, y: 100 },
            data: {
              label: '车身服务',
              serviceType: 'SOME/IP',
              protocol: 'UDP',
              interface: 'IBodyControl',
            },
          },
          {
            id: 'service-adas',
            type: 'service',
            position: { x: 500, y: 100 },
            data: {
              label: 'ADAS服务',
              serviceType: 'SOME/IP',
              protocol: 'TCP',
              interface: 'IADASControl',
            },
          },
        ],
        edges: [],
      },
      'body-domain': {
        nodes: [
          {
            id: 'body-dc',
            type: 'domainController',
            position: { x: 300, y: 150 },
            data: {
              label: '车身域控制器',
              domain: 'Body',
              hwId: 'DC-BODY-001',
              swVersion: 'v2.1.0',
              services: ['Lighting', 'HVAC', 'Doors', 'Windows'],
            },
          },
          {
            id: 'bcm',
            type: 'ecu',
            position: { x: 100, y: 350 },
            data: {
              label: 'BCM',
              hwId: 'BCM-001',
              swVersion: 'v1.8.0',
            },
          },
          {
            id: 'door-ecu',
            type: 'actuator',
            position: { x: 500, y: 350 },
            data: {
              label: '车门控制器',
              hwId: 'DOOR-001',
            },
          },
        ],
        edges: [
          {
            id: 'e-body-bcm',
            source: 'body-dc',
            target: 'bcm',
            type: 'smoothstep',
            label: 'CAN',
            data: { busType: 'CAN', bandwidth: '500kbps', latency: '5ms' },
            style: edgeStyles.CAN,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          {
            id: 'e-body-door',
            source: 'body-dc',
            target: 'door-ecu',
            type: 'smoothstep',
            label: 'LIN',
            data: { busType: 'LIN', bandwidth: '20kbps', latency: '10ms' },
            style: edgeStyles.LIN,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
        ],
      },
      'powertrain': {
        nodes: [
          {
            id: 'vcu',
            type: 'ecu',
            position: { x: 300, y: 150 },
            data: {
              label: 'VCU (整车控制器)',
              hwId: 'VCU-001',
              swVersion: 'v2.0.0',
            },
          },
          {
            id: 'bms',
            type: 'ecu',
            position: { x: 100, y: 350 },
            data: {
              label: 'BMS (电池管理)',
              hwId: 'BMS-001',
              swVersion: 'v1.5.0',
            },
          },
          {
            id: 'mcu',
            type: 'ecu',
            position: { x: 500, y: 350 },
            data: {
              label: 'MCU (电机控制)',
              hwId: 'MCU-001',
              swVersion: 'v1.3.0',
            },
          },
        ],
        edges: [
          {
            id: 'e-vcu-bms',
            source: 'vcu',
            target: 'bms',
            type: 'smoothstep',
            label: 'CAN-FD',
            data: { busType: 'CAN-FD', bandwidth: '5Mbps', latency: '2ms' },
            style: edgeStyles['CAN-FD'],
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          {
            id: 'e-vcu-mcu',
            source: 'vcu',
            target: 'mcu',
            type: 'smoothstep',
            label: 'CAN-FD',
            data: { busType: 'CAN-FD', bandwidth: '5Mbps', latency: '2ms' },
            style: edgeStyles['CAN-FD'],
            markerEnd: { type: MarkerType.ArrowClosed },
          },
        ],
      },
    };

    const template = templates[templateId];
    if (template) {
      setNodes(template.nodes);
      setEdges(template.edges);
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  }, [setNodes, setEdges]);
  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges]);

  // Update edge bus type
  const updateEdgeBusType = useCallback((edgeId, busType) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id === edgeId) {
          return {
            ...e,
            data: { ...e.data, busType },
            style: edgeStyles[busType] || edgeStyles.CAN,
            label: `${busType} ${e.data.bandwidth}`,
          };
        }
        return e;
      })
    );
  }, [setEdges]);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
    }}>
      {/* Top Navbar */}
      <TopNavbar
        onNewProject={() => {
          setNodes([]);
          setEdges([]);
        }}
        onOpenProject={() => document.getElementById('import-file-input')?.click()}
        onSave={exportToJSON}
        onExport={(format) => {
          if (format === 'json') exportToJSON();
          else setIsValidationPanelOpen(true);
        }}
        onImport={() => document.getElementById('import-file-input')?.click()}
        onValidate={() => setIsValidationPanelOpen(true)}
        onSettings={() => alert('设置功能开发中')}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onSimulationChange={setCurrentView}
      />

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Project Selection Sidebar */}
        <ProjectSidebar
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />

        {/* Left Component Panel Sidebar */}
        <LeftSidebar
          onAddNode={addNode}
          selectedNodeType={newNodeType}
          onSelectNodeType={setNewNodeType}
          onLoadTemplate={loadTemplate}
          onSimulationChange={setCurrentView}
        />

        {/* Main Canvas */}
        <div style={{ flex: 1, position: 'relative' }} onClick={closeContextMenu}>
          {currentView === 'editor' ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneContextMenu={onPaneContextMenu}
              onNodeContextMenu={onNodeContextMenu}
              onEdgeContextMenu={onEdgeContextMenu}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Background color="#aaa" gap={16} />
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'gateway': return '#ff6b6b';
                    case 'domainController': return '#4ecdc4';
                    case 'ecu': return '#45b7d1';
                    case 'sensor': return '#96ceb4';
                    case 'actuator': return '#ffeaa7';
                    case 'switch': return '#dfe6e9';
                    case 'service': return '#fd79a8';
                    default: return '#95a5a6';
                  }
                }}
              />
            </ReactFlow>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#ffffff', overflow: 'auto' }}>
              <SimulationPanel
                isOpen={true}
                simulationType={currentView}
                onClose={() => setCurrentView('editor')}
                embedded={true}
              />
            </div>
          )}
        </div>

        {/* Right Properties Panel */}
        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          nodes={nodes}
          edges={edges}
          onUpdateNode={(updates) => {
            setNodes((nds) =>
              nds.map((n) => {
                if (n.id === selectedNode.id) {
                  return { ...n, data: { ...n.data, ...updates } };
                }
                return n;
              })
            );
            setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, ...updates } });
          }}
          onUpdateEdge={(updates) => {
            setEdges((eds) =>
              eds.map((e) => {
                if (e.id === selectedEdge.id) {
                  const newBusType = updates.busType || e.data.busType;
                  const newBandwidth = updates.bandwidth || e.data.bandwidth;
                  return {
                    ...e,
                    data: { ...e.data, ...updates },
                    style: edgeStyles[newBusType] || e.style,
                    label: `${newBusType} ${newBandwidth}`,
                  };
                }
                return e;
              })
            );
            setSelectedEdge({ ...selectedEdge, data: { ...selectedEdge.data, ...updates } });
          }}
          onDeleteNode={deleteSelected}
          onDeleteEdge={deleteSelected}
        />
      </div>

      {/* Hidden file input for import */}
      <input
        id="import-file-input"
        type="file"
        accept=".json"
        onChange={importFromJSON}
        style={{ display: 'none' }}
      />

      {/* Validation Panel Modal */}
      <ValidationPanel 
        nodes={nodes} 
        edges={edges} 
        isOpen={isValidationPanelOpen} 
        onClose={() => setIsValidationPanelOpen(false)} 
      />

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#ffffff',
            border: '1px solid #d0d7de',
            borderRadius: '2px',
            boxShadow: '0 8px 24px rgba(27,31,35,0.12), 0 1px 3px rgba(27,31,35,0.08)',
            minWidth: '220px',
            zIndex: 10000,
            overflow: 'hidden',
          }}
        >
          {contextMenu.type === 'node' && (
            <>
              <div
                onClick={() => {
                  const newNode = {
                    ...contextMenu.node,
                    id: `${contextMenu.node.type}-${Date.now()}`,
                    position: {
                      x: contextMenu.node.position.x + 50,
                      y: contextMenu.node.position.y + 50,
                    },
                  };
                  setNodes((nds) => [...nds, newNode]);
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>复制</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+C</span>
              </div>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(contextMenu.node, null, 2));
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>剪切</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+X</span>
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  setSelectedNode(contextMenu.node);
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                编辑属性
              </div>
              <div
                onClick={() => {
                  const allNodes = nodes.filter(n => n.type === contextMenu.node.type);
                  allNodes.forEach(n => {
                    setSelectedNode(n);
                  });
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                选择相同类型
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === contextMenu.node.id
                        ? { ...n, position: { x: n.position.x, y: n.position.y - 10 } }
                        : n
                    )
                  );
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>置于顶层</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+↑</span>
              </div>
              <div
                onClick={() => {
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === contextMenu.node.id
                        ? { ...n, position: { x: n.position.x, y: n.position.y + 10 } }
                        : n
                    )
                  );
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>置于底层</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+↓</span>
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  const nodeData = contextMenu.node.data;
                  alert(JSON.stringify(nodeData, null, 2));
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                查看详情
              </div>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(contextMenu.node.id);
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                复制ID
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  setNodes((nds) => nds.filter((n) => n.id !== contextMenu.node.id));
                  setEdges((eds) => eds.filter((e) => e.source !== contextMenu.node.id && e.target !== contextMenu.node.id));
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#cf222e',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ffebe9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>删除</span>
                <span style={{ fontSize: '10px', color: '#cf222e', fontFamily: 'monospace' }}>Del</span>
              </div>
            </>
          )}

          {contextMenu.type === 'edge' && (
            <>
              <div
                onClick={() => {
                  setSelectedEdge(contextMenu.edge);
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                编辑连接属性
              </div>
              <div
                onClick={() => {
                  const edgeData = contextMenu.edge.data;
                  const busTypes = ['CAN', 'CAN-FD', 'Ethernet', 'LIN', 'FlexRay'];
                  const currentIndex = busTypes.indexOf(edgeData.busType || 'CAN');
                  const newBusType = busTypes[(currentIndex + 1) % busTypes.length];
                  updateEdgeBusType(contextMenu.edge.id, newBusType);
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                切换总线类型
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  const reversedEdge = {
                    ...contextMenu.edge,
                    id: `${contextMenu.edge.id}-reversed`,
                    source: contextMenu.edge.target,
                    target: contextMenu.edge.source,
                  };
                  setEdges((eds) => [...eds, reversedEdge]);
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                反向复制连接
              </div>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(contextMenu.edge.data, null, 2));
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                复制连接信息
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  setEdges((eds) => eds.filter((e) => e.id !== contextMenu.edge.id));
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#cf222e',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ffebe9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>删除连接</span>
                <span style={{ fontSize: '10px', color: '#cf222e', fontFamily: 'monospace' }}>Del</span>
              </div>
            </>
          )}

          {contextMenu.type === 'canvas' && (
            <>
              <div
                onClick={() => {
                  const newNode = {
                    id: `${newNodeType}-${Date.now()}`,
                    type: newNodeType,
                    position: { x: Math.random() * 500, y: Math.random() * 500 },
                    data: { label: `New ${newNodeType}` },
                  };
                  setNodes((nds) => [...nds, newNode]);
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>添加节点</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+N</span>
              </div>
              <div
                onClick={() => {
                  if (nodes.length > 0 && navigator.clipboard) {
                    const lastNode = nodes[nodes.length - 1];
                    const newNode = {
                      ...lastNode,
                      id: `${lastNode.type}-${Date.now()}`,
                      position: {
                        x: lastNode.position.x + 50,
                        y: lastNode.position.y + 50,
                      },
                    };
                    setNodes((nds) => [...nds, newNode]);
                  }
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>粘贴</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+V</span>
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  setNodes((nds) => nds.map(n => ({ ...n })));
                  setEdges((eds) => eds.map(e => ({ ...e })));
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>全选</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+A</span>
              </div>
              <div
                onClick={() => {
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>缩放适应</span>
                <span style={{ fontSize: '10px', color: '#656d76', fontFamily: 'monospace' }}>Ctrl+0</span>
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  exportToJSON();
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                导出JSON
              </div>
              <div
                onClick={() => {
                  document.getElementById('import-file-input')?.click();
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f6f8fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                导入JSON
              </div>
              <div style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
              <div
                onClick={() => {
                  if (confirm('确定要清空画布吗？')) {
                    setNodes([]);
                    setEdges([]);
                  }
                  closeContextMenu();
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#cf222e',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ffebe9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                清空画布
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleArchitectureDesigner;
