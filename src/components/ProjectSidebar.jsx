import { useState } from 'react';

const ProjectSidebar = ({ onSelectProject, selectedProject }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [projects] = useState([
    {
      id: 'proj-001',
      name: 'ADAS平台',
      description: '智能驾驶辅助系统',
      lastModified: '2024-11-05',
      status: 'active',
    },
    {
      id: 'proj-002',
      name: '车身域控',
      description: 'BCM域控制器架构',
      lastModified: '2024-11-03',
      status: 'active',
    },
    {
      id: 'proj-003',
      name: '动力系统',
      description: 'VCU电机控制架构',
      lastModified: '2024-10-28',
      status: 'archived',
    },
    {
      id: 'proj-004',
      name: 'SOA服务',
      description: 'SOME/IP服务设计',
      lastModified: '2024-11-01',
      status: 'active',
    },
  ]);

  if (collapsed) {
    return (
      <div style={{
        width: '48px',
        background: '#f6f8fa',
        borderRight: '1px solid #d0d7de',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '12px',
        gap: '8px',
      }}>
        {/* Expand Button */}
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            padding: '8px 4px',
            color: '#57606a',
            transition: 'all 0.15s',
            fontWeight: '600',
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            letterSpacing: '2px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#0969da';
            e.currentTarget.style.background = '#e8f1ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#57606a';
            e.currentTarget.style.background = 'none';
          }}
          title="展开项目列表"
        >
          项目
        </button>

        {/* New Project Icon */}
        <div style={{ marginTop: 'auto', marginBottom: '12px' }}>
          <button
            onClick={() => {}}
            style={{
              width: '36px',
              height: '36px',
              background: '#0969da',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0860ca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0969da';
            }}
            title="新建项目"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '240px',
      background: '#f6f8fa',
      borderRight: '1px solid #d0d7de',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #d0d7de',
        background: 'linear-gradient(180deg, #ffffff 0%, #f6f8fa 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '13px', 
          fontWeight: '600', 
          color: '#24292f',
          letterSpacing: '-0.2px',
        }}>
          项目列表
        </h3>
        <button
          onClick={() => setCollapsed(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px',
            color: '#57606a',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#0969da';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#57606a';
          }}
          title="收缩"
        >
          ◀
        </button>
      </div>

      {/* New Project Button */}
      <div style={{ padding: '12px' }}>
        <button
          onClick={() => {}}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#0969da',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0860ca';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0969da';
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          <span>新建项目</span>
        </button>
      </div>

      {/* Project List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject?.(project)}
              style={{
                padding: '10px 12px',
                background: selectedProject?.id === project.id ? '#e8f1ff' : '#ffffff',
                border: selectedProject?.id === project.id ? '1px solid #0969da' : '1px solid #d0d7de',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                opacity: project.status === 'archived' ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (selectedProject?.id !== project.id) {
                  e.currentTarget.style.background = '#f6f8fa';
                  e.currentTarget.style.borderColor = '#0969da';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedProject?.id !== project.id) {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#d0d7de';
                }
              }}
            >
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#24292f',
                marginBottom: '4px',
                letterSpacing: '-0.1px',
              }}>
                {project.name}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#656d76',
                marginBottom: '6px',
                lineHeight: '1.3',
              }}>
                {project.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#656d76',
                  fontFamily: 'ui-monospace, monospace',
                }}>
                  {project.lastModified}
                </div>
                {project.status === 'archived' && (
                  <div style={{
                    fontSize: '9px',
                    color: '#656d76',
                    background: '#eaecef',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '600',
                  }}>
                    已归档
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #d0d7de',
        background: '#ffffff',
        fontSize: '11px',
        color: '#656d76',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>活跃项目</span>
          <span style={{ fontWeight: '600', color: '#24292f' }}>
            {projects.filter(p => p.status === 'active').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
