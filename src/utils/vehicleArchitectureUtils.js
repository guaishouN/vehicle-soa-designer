/**
 * Vehicle Architecture Utilities
 * Provides validation, export, and analysis functions
 */

// Validate network bandwidth and latency requirements
export const validateNetworkRequirements = (nodes, edges) => {
  const issues = [];
  
  // Check bandwidth constraints
  edges.forEach(edge => {
    const bandwidth = edge.data?.bandwidth || '0';
    const busType = edge.data?.busType || 'Unknown';
    
    // Define bus type limits
    const limits = {
      'CAN': 1, // 1 Mbps
      'CAN-FD': 8, // 8 Mbps
      'LIN': 0.02, // 20 kbps
      'Ethernet': 1000, // 1 Gbps
      'FlexRay': 10, // 10 Mbps
    };
    
    const bandwidthValue = parseFloat(bandwidth);
    const limit = limits[busType];
    
    if (limit && bandwidthValue > limit) {
      issues.push({
        type: 'bandwidth_exceeded',
        edge: edge.id,
        message: `${busType} bandwidth ${bandwidth} exceeds limit of ${limit}Mbps`,
      });
    }
  });
  
  return issues;
};

// Export to AUTOSAR ARXML format (simplified)
export const exportToARXML = (nodes, edges) => {
  const arxml = `<?xml version="1.0" encoding="UTF-8"?>
<AUTOSAR xmlns="http://autosar.org/schema/r4.0">
  <AR-PACKAGES>
    <AR-PACKAGE>
      <SHORT-NAME>VehicleArchitecture</SHORT-NAME>
      <ELEMENTS>
        ${nodes.map(node => `
        <ECU-INSTANCE>
          <SHORT-NAME>${node.data.label.replace(/\s/g, '_')}</SHORT-NAME>
          <HW-ID>${node.data.hwId || 'N/A'}</HW-ID>
          <SW-VERSION>${node.data.swVersion || 'N/A'}</SW-VERSION>
          <TYPE>${node.type}</TYPE>
        </ECU-INSTANCE>`).join('')}
      </ELEMENTS>
      <SUB-PACKAGES>
        <AR-PACKAGE>
          <SHORT-NAME>Communications</SHORT-NAME>
          <ELEMENTS>
            ${edges.map(edge => `
            <CAN-CLUSTER>
              <SHORT-NAME>Connection_${edge.id}</SHORT-NAME>
              <BUS-TYPE>${edge.data.busType || 'CAN'}</BUS-TYPE>
              <BANDWIDTH>${edge.data.bandwidth || 'N/A'}</BANDWIDTH>
              <LATENCY>${edge.data.latency || 'N/A'}</LATENCY>
            </CAN-CLUSTER>`).join('')}
          </ELEMENTS>
        </AR-PACKAGE>
      </SUB-PACKAGES>
    </AR-PACKAGE>
  </AR-PACKAGES>
</AUTOSAR>`;
  
  return arxml;
};

// Export to PlantUML diagram
export const exportToPlantUML = (nodes, edges) => {
  let uml = '@startuml Vehicle Architecture\n';
  uml += '!define RECTANGLE class\n\n';
  
  // Add nodes
  nodes.forEach(node => {
    const nodeType = node.type;
    uml += `${nodeType} "${node.data.label}" as ${node.id} {\n`;
    uml += `  HW: ${node.data.hwId || 'N/A'}\n`;
    uml += `  SW: ${node.data.swVersion || 'N/A'}\n`;
    uml += '}\n\n';
  });
  
  // Add connections
  edges.forEach(edge => {
    const label = edge.data.busType || 'Connection';
    uml += `${edge.source} --> ${edge.target} : ${label}\\n${edge.data.bandwidth || ''}\n`;
  });
  
  uml += '@enduml';
  return uml;
};

// Export to CSV format
export const exportToCSV = (nodes, edges) => {
  let csv = 'Nodes\n';
  csv += 'ID,Type,Label,HW_ID,SW_Version,Additional_Data\n';
  
  nodes.forEach(node => {
    csv += `${node.id},${node.type},"${node.data.label}",${node.data.hwId || ''},${node.data.swVersion || ''},"${JSON.stringify(node.data).replace(/"/g, '""')}"\n`;
  });
  
  csv += '\nEdges\n';
  csv += 'ID,Source,Target,Bus_Type,Bandwidth,Latency\n';
  
  edges.forEach(edge => {
    csv += `${edge.id},${edge.source},${edge.target},${edge.data?.busType || ''},${edge.data?.bandwidth || ''},${edge.data?.latency || ''}\n`;
  });
  
  return csv;
};

// Analyze network topology
export const analyzeTopology = (nodes, edges) => {
  const analysis = {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodesByType: {},
    edgesByBusType: {},
    domains: new Set(),
  };
  
  // Count nodes by type
  nodes.forEach(node => {
    analysis.nodesByType[node.type] = (analysis.nodesByType[node.type] || 0) + 1;
    if (node.data.domain) {
      analysis.domains.add(node.data.domain);
    }
  });
  
  // Count edges by bus type
  edges.forEach(edge => {
    const busType = edge.data?.busType || 'Unknown';
    analysis.edgesByBusType[busType] = (analysis.edgesByBusType[busType] || 0) + 1;
  });
  
  analysis.domains = Array.from(analysis.domains);
  
  return analysis;
};

// Calculate network latency path
export const calculateLatencyPath = (edges, startNode, endNode) => {
  // Simple path finding and latency calculation
  // This is a simplified version - a real implementation would use graph algorithms
  const path = [];
  let totalLatency = 0;
  
  edges.forEach(edge => {
    if (edge.source === startNode || edge.target === endNode) {
      path.push(edge);
      const latency = parseFloat(edge.data?.latency || '0');
      totalLatency += latency;
    }
  });
  
  return {
    path,
    totalLatency: `${totalLatency}ms`,
    hops: path.length,
  };
};

// Generate SOME/IP service configuration
export const generateSomeIPConfig = (serviceNodes) => {
  const config = {
    services: serviceNodes.map(node => ({
      serviceId: node.data.serviceId || '0x1234',
      instanceId: node.data.instanceId || '0x0001',
      majorVersion: node.data.majorVersion || '1',
      minorVersion: node.data.minorVersion || '0',
      interface: node.data.interface || 'IUnknown',
      methods: node.data.methods || [],
      events: node.data.events || [],
    })),
  };
  
  return JSON.stringify(config, null, 2);
};

// Validate redundancy requirements
export const validateRedundancy = (nodes, edges) => {
  const criticalNodes = nodes.filter(node => node.data.redundancy);
  const issues = [];
  
  criticalNodes.forEach(node => {
    const connections = edges.filter(
      edge => edge.source === node.id || edge.target === node.id
    );
    
    if (connections.length < 2) {
      issues.push({
        type: 'redundancy_missing',
        node: node.id,
        message: `Critical node ${node.data.label} has insufficient redundant connections`,
      });
    }
  });
  
  return issues;
};
