# Vehicle Architecture Designer

A comprehensive desktop application for designing automotive E/E (Electrical/Electronic) architectures using interactive flow diagrams.

## Features

- **Interactive Flow Designer**: Built with React Flow (xyflow)
- **Custom Automotive Nodes**: ECU, Domain Controllers, Gateways, Sensors, Actuators, Switches, Services
- **Multiple Bus Types**: CAN, CAN-FD, LIN, Ethernet, FlexRay, Virtual/Service connections
- **Validation & Analysis**: Network bandwidth validation, redundancy checking, topology analysis
- **Export Formats**: JSON, AUTOSAR ARXML, PlantUML, CSV
- **Desktop Application**: Packaged with Tauri for Windows, macOS, and Linux

## Technology Stack

- **Frontend**: React 19 + Vite
- **Flow Editor**: @xyflow/react (React Flow)
- **Desktop Framework**: Tauri v2
- **Language**: JavaScript/JSX

## Prerequisites

Before running the Tauri desktop app, ensure you have:

1. **Node.js** (v20.19+ or v22.12+)
2. **Rust** (latest stable) - [Install Rust](https://www.rust-lang.org/tools/install)
3. **System Dependencies** (Windows):
   - Visual Studio Build Tools or Visual Studio with C++ development tools
   - WebView2 (usually pre-installed on Windows 10/11)

## Installation

```bash
# Install npm dependencies
npm install
```

## Development

### Run as Web Application

```bash
# Start Vite dev server
npm run dev
```

Open http://localhost:5173 in your browser.

### Run as Desktop Application (Tauri)

```bash
# Start Tauri in development mode
npm run tauri:dev
```

This will:
1. Start the Vite dev server
2. Compile the Rust backend
3. Open the application in a native window

## Building for Production

### Build Web Application

```bash
npm run build
```

Output: `dist/` folder

### Build Desktop Application

```bash
npm run tauri:build
```

This will create platform-specific installers in `src-tauri/target/release/bundle/`:

- **Windows**: `.msi` and `.exe` installers
- **macOS**: `.dmg` and `.app`
- **Linux**: `.deb`, `.AppImage`, etc.

## Project Structure

```
my-vite-react-app/
├── src/
│   ├── VehicleArchitectureDesigner.jsx  # Main designer component
│   ├── components/                       # UI Components
│   │   ├── TopNavbar.jsx                # Top navigation bar
│   │   ├── LeftSidebar.jsx              # Left tool palette
│   │   ├── PropertiesPanel.jsx          # Right properties panel
│   │   └── ValidationPanel.jsx          # Validation & export modal
│   ├── nodes/                           # Custom node components
│   │   ├── ECUNode.jsx
│   │   ├── DomainControllerNode.jsx
│   │   ├── SensorNode.jsx
│   │   ├── GatewayNode.jsx
│   │   ├── ActuatorNode.jsx
│   │   ├── SwitchNode.jsx
│   │   └── ServiceNode.jsx
│   └── utils/
│       └── vehicleArchitectureUtils.js  # Utility functions
├── src-tauri/                            # Tauri backend
│   ├── src/
│   │   └── main.rs                      # Rust entry point
│   ├── Cargo.toml                       # Rust dependencies
│   └── tauri.conf.json                  # Tauri configuration
└── package.json
```

## UI Structure

The application uses a three-layer layout:

```
┌────────────────────────────────────────────┐
│ ① Top Navbar (Global Operations)          │
├──────────────┬──────────────────────────────┤
│ ② Left       │ ③ Main Canvas (XYFlow)      │
│   Sidebar    │                              │
│   (Tools &   │    [Flow Editor]             │
│    Palette)  │                              │
│              ├──────────────────────────────┤
│              │ ④ Right Properties Panel     │
└──────────────┴──────────────────────────────┘
```

**① Top Navbar**: Project management, import/export, view controls, validation tools

**② Left Sidebar**: Drag-and-drop component palette with categorized nodes:
- 🏗️ Structure Nodes (ECU, Domain Controllers, Gateways, etc.)
- 🔗 Network Connections (CAN, Ethernet, FlexRay, etc.)
- ☁️ Software Components (SOME/IP Services, Interfaces)
- 📝 Annotations (Text, Groups, Icons)

**③ Main Canvas**: Interactive flow editor with React Flow

**④ Right Properties Panel**: Tabbed property editor with:
- Basic Information
- Network Properties
- Function Interfaces
- Software Configuration
- Electrical Properties
- Validation Results

## Usage Guide

1. **Add Nodes**: Select node type from dropdown and click "Add Node"
2. **Create Connections**: Drag from a node's handle to another node
3. **Edit Properties**: Click nodes/edges to edit in the properties panel
4. **Change Bus Type**: Select an edge and change the bus type
5. **Validate Architecture**: Click "Validate & Export" to check for issues
6. **Export**: Export to ARXML, PlantUML, or CSV formats
7. **Save/Load**: Use "Export JSON" and "Import JSON" to save your work

## Customization

### Adding Custom Node Types

1. Create a new component in `src/nodes/`
2. Register it in `VehicleArchitectureDesigner.jsx`'s `nodeTypes` object
3. Add it to the dropdown menu

### Adding Export Formats

Add new export functions in `src/utils/vehicleArchitectureUtils.js`

## Troubleshooting

### Tauri Build Issues

**Error: Rust not found**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Error: WebView2 not found (Windows)**
- Download and install [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/)

### Icon Issues

If you see icon-related errors:
1. Create a 512x512 PNG icon
2. Run: `npx @tauri-apps/cli icon path/to/icon.png`
3. This will generate all required icon sizes

## License

MIT
