import { useState } from 'react';

const TopNavbar = ({ onNewProject, onOpenProject, onSave, onExport, onImport, onValidate, onSettings, onToggleFullscreen, isFullscreen, onSimulationChange }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = {
    project: {
      label: 'PROJECT',
      items: [
        { label: '新建', shortcut: 'Ctrl+N', action: onNewProject },
        { label: '打开', shortcut: 'Ctrl+O', action: onOpenProject },
        { label: '保存', shortcut: 'Ctrl+S', action: onSave },
        { label: '另存为', shortcut: 'Ctrl+Shift+S', action: onSave },
        { type: 'divider' },
        { label: '导入 JSON', action: onImport },
        { label: '导出 JSON', action: () => onExport('json') },
      ],
    },
    view: {
      label: 'VIEW',
      items: [
        { label: '缩放适应', shortcut: 'Ctrl+0', action: () => {} },
        { label: '自动布局', shortcut: 'Ctrl+L', action: () => {} },
        { label: '显示网格', action: () => {} },
        { type: 'divider' },
        { label: '域过滤', action: () => {} },
        { label: '分层显示', action: () => {} },
        { type: 'divider' },
        { label: isFullscreen ? '退出全屏' : '全屏模式', shortcut: 'F11', action: onToggleFullscreen },
      ],
    },
    tools: {
      label: 'TOOLS',
      items: [
        { label: '检查模型', action: onValidate },
        { label: '带宽仿真', action: () => {} },
        { label: '生成配置文件', action: () => {} },
        { type: 'divider' },
        { label: '导出 ARXML', action: () => onExport('arxml') },
        { label: '导出 PlantUML', action: () => onExport('plantuml') },
        { label: '导出 CSV', action: () => onExport('csv') },
      ],
    },
    simulation: {
      label: 'SIMULATION',
      items: [
        { label: '网络仿真', action: () => onSimulationChange?.('network-sim') },
        { label: '带宽分析', action: () => onSimulationChange?.('bandwidth-analysis') },
        { label: '延迟分析', action: () => onSimulationChange?.('latency-test') },
        { type: 'divider' },
        { label: '负载测试', action: () => onSimulationChange?.('load-test') },
        { label: '故障注入', action: () => onSimulationChange?.('fault-injection') },
        { type: 'divider' },
        { label: '仿真报告', action: () => onSimulationChange?.('report') },
      ],
    },
    developer: {
      label: 'DEVELOPER',
      items: [
        { label: '编辑节点模板', action: () => {} },
        { label: '自定义规则', action: () => {} },
        { label: '脚本调试', action: () => {} },
      ],
    },
    system: {
      label: 'SYSTEM',
      items: [
        { label: '设置', action: onSettings },
        { label: '主题切换', action: () => {} },
        { label: '语言', action: () => {} },
        { type: 'divider' },
        { label: '关于', action: () => {} },
      ],
    },
  };

  const toggleMenu = (menuKey) => {
    setActiveMenu(activeMenu === menuKey ? null : menuKey);
  };

  return (
    <div style={{ 
      height: '60px', 
      background: 'linear-gradient(180deg, #ffffff 0%, #f6f8fa 100%)',
      color: '#24292f',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      borderBottom: '1px solid #d0d7de',
      boxShadow: '0 1px 3px rgba(27,31,35,0.08)',
      position: 'relative',
      zIndex: 1000,
    }}>
      <div style={{ 
        fontWeight: '600', 
        fontSize: '15px', 
        marginRight: '48px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        color: '#24292f',
        letterSpacing: '0.3px',
      }}>
        <span style={{ color: '#0969da', fontWeight: '700' }}>深圳德赛西威</span>
        <span style={{ color: '#24292f' }}>整车SOA设计平台</span>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: '600',
          background: 'linear-gradient(135deg, #0969da, #1f883d)',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          marginLeft: '8px',
        }}>BETA</span>
      </div>

      <div style={{ display: 'flex', gap: '2px', flex: 1, alignItems: 'center' }}>
        {Object.entries(menuItems).map(([key, menu]) => (
          <div key={key} style={{ position: 'relative' }}>
            <button
              onClick={() => toggleMenu(key)}
              onMouseEnter={() => setActiveMenu(key)}
              style={{
                background: activeMenu === key ? 'rgba(234, 238, 242, 0.8)' : 'transparent',
                border: 'none',
                color: activeMenu === key ? '#0969da' : '#57606a',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
              onMouseOver={(e) => {
                if (activeMenu !== key) {
                  e.currentTarget.style.background = 'rgba(234, 238, 242, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (activeMenu !== key) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {menu.label}
            </button>

            {activeMenu === key && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  background: '#ffffff',
                  color: '#24292f',
                  borderRadius: '6px',
                  border: '1px solid #d0d7de',
                  boxShadow: '0 8px 24px rgba(27,31,35,0.12), 0 1px 3px rgba(27,31,35,0.08)',
                  minWidth: '200px',
                  overflow: 'hidden',
                  animation: 'slideDown 0.15s ease-out',
                }}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menu.items.map((item, idx) => (
                  item.type === 'divider' ? (
                    <div key={idx} style={{ height: '1px', background: '#eaecef', margin: '4px 0' }} />
                  ) : (
                    <div
                      key={idx}
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                      style={{
                        padding: '8px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.12s ease',
                        fontSize: '13px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f6f8fa';
                        e.currentTarget.style.paddingLeft = '18px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.paddingLeft = '14px';
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ fontSize: '10px', color: '#656d76', marginLeft: '24px', fontFamily: 'ui-monospace, monospace', opacity: 0.8 }}>
                          {item.shortcut}
                        </span>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        marginLeft: '16px',
        paddingLeft: '16px',
        borderLeft: '1px solid #d0d7de',
      }}>
        <div style={{ 
          fontSize: '11px', 
          color: '#656d76', 
          fontFamily: 'ui-monospace, monospace',
          padding: '4px 10px',
          background: '#f6f8fa',
          borderRadius: '6px',
          border: '1px solid #d0d7de',
          fontWeight: '600',
        }}>
          v1.0.0
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
