import { useState } from 'react';
import {
  validateNetworkRequirements,
  validateRedundancy,
  exportToARXML,
  exportToPlantUML,
  exportToCSV,
  analyzeTopology,
} from '../utils/vehicleArchitectureUtils';

const ValidationPanel = ({ nodes, edges, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('validation');
  const [validationResults, setValidationResults] = useState(null);
  const [topologyAnalysis, setTopologyAnalysis] = useState(null);

  if (!isOpen) return null;

  const runValidation = () => {
    const networkIssues = validateNetworkRequirements(nodes, edges);
    const redundancyIssues = validateRedundancy(nodes, edges);
    
    setValidationResults({
      networkIssues,
      redundancyIssues,
      totalIssues: networkIssues.length + redundancyIssues.length,
    });
  };

  const runAnalysis = () => {
    const analysis = analyzeTopology(nodes, edges);
    setTopologyAnalysis(analysis);
  };

  const handleExport = (format) => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'arxml':
        content = exportToARXML(nodes, edges);
        filename = `vehicle-architecture-${Date.now()}.arxml`;
        mimeType = 'application/xml';
        break;
      case 'plantuml':
        content = exportToPlantUML(nodes, edges);
        filename = `vehicle-architecture-${Date.now()}.puml`;
        mimeType = 'text/plain';
        break;
      case 'csv':
        content = exportToCSV(nodes, edges);
        filename = `vehicle-architecture-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Validation & Export</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #dee2e6' }}>
          {['validation', 'analysis', 'export'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === tab ? '#4ecdc4' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflow: 'auto', flex: 1 }}>
          {/* Validation Tab */}
          {activeTab === 'validation' && (
            <div>
              <button
                onClick={runValidation}
                style={{
                  padding: '10px 20px',
                  background: '#4ecdc4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              >
                Run Validation
              </button>

              {validationResults && (
                <div>
                  <h3>Validation Results</h3>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: validationResults.totalIssues > 0 ? '#e74c3c' : '#27ae60' }}>
                    {validationResults.totalIssues === 0 ? '✓ No issues found' : `⚠ ${validationResults.totalIssues} issue(s) found`}
                  </p>

                  {validationResults.networkIssues.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <h4>Network Issues</h4>
                      {validationResults.networkIssues.map((issue, idx) => (
                        <div key={idx} style={{ padding: '10px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginBottom: '8px' }}>
                          <strong>{issue.type}:</strong> {issue.message}
                        </div>
                      ))}
                    </div>
                  )}

                  {validationResults.redundancyIssues.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <h4>Redundancy Issues</h4>
                      {validationResults.redundancyIssues.map((issue, idx) => (
                        <div key={idx} style={{ padding: '10px', background: '#f8d7da', border: '1px solid #dc3545', borderRadius: '4px', marginBottom: '8px' }}>
                          <strong>{issue.type}:</strong> {issue.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div>
              <button
                onClick={runAnalysis}
                style={{
                  padding: '10px 20px',
                  background: '#45b7d1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              >
                Analyze Topology
              </button>

              {topologyAnalysis && (
                <div>
                  <h3>Topology Analysis</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <h4>Overview</h4>
                    <p>Total Nodes: {topologyAnalysis.totalNodes}</p>
                    <p>Total Connections: {topologyAnalysis.totalEdges}</p>
                    <p>Domains: {topologyAnalysis.domains.join(', ') || 'None'}</p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4>Nodes by Type</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                          <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Type</th>
                          <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(topologyAnalysis.nodesByType).map(([type, count]) => (
                          <tr key={type}>
                            <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{type}</td>
                            <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4>Connections by Bus Type</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                          <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Bus Type</th>
                          <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(topologyAnalysis.edgesByBusType).map(([type, count]) => (
                          <tr key={type}>
                            <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{type}</td>
                            <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div>
              <h3>Export Architecture</h3>
              <p>Export the vehicle architecture to different formats:</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => handleExport('arxml')}
                  style={{
                    padding: '12px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong>Export to AUTOSAR ARXML</strong>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Export architecture for AUTOSAR toolchains</div>
                </button>

                <button
                  onClick={() => handleExport('plantuml')}
                  style={{
                    padding: '12px 20px',
                    background: '#f093fb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong>Export to PlantUML</strong>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Generate UML diagrams for documentation</div>
                </button>

                <button
                  onClick={() => handleExport('csv')}
                  style={{
                    padding: '12px 20px',
                    background: '#96ceb4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong>Export to CSV</strong>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>Export data for spreadsheet analysis</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
