import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'
import type { Connection, Node, Edge, NodeChange, EdgeChange } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from '../store/useStore'
import { Plus, Maximize2, Trash2 } from 'lucide-react'

const generateId = () => Math.random().toString(36).substr(2, 9)

const nodeColors: Record<string, string> = {
  english:    '#a78bfa',
  grammar:    '#a78bfa',
  vocabulary: '#fbbf24',
  speaking:   '#34d399',
  writing:    '#60a5fa',
  reading:    '#60a5fa',
}

function getNodeColor(id: string, data: { color?: string }): string {
  return data.color || nodeColors[id] || '#8b7fb5'
}

interface CustomNodeData {
  label: string
  color?: string
  [key: string]: unknown
}

function CustomNode({ id, data, selected }: { id: string; data: CustomNodeData; selected: boolean }) {
  const color = getNodeColor(id, data)
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const { setNodes } = useReactFlow()

  const handleDoubleClick = () => setEditing(true)

  const handleBlur = () => {
    setEditing(false)
    setNodes(nodes => nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n))
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        background: `${color}12`,
        border: `1.5px solid ${selected ? color : color + '50'}`,
        borderRadius: 10,
        padding: '10px 18px',
        minWidth: 100,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: selected ? `0 0 16px ${color}35, 0 0 0 3px ${color}15` : 'none',
        backdropFilter: 'blur(8px)',
      }}
    >
      {editing ? (
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => e.key === 'Enter' && handleBlur()}
          autoFocus
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: '#ede8ff', fontSize: 13, fontWeight: 600,
            textAlign: 'center', width: '100%', fontFamily: 'inherit',
          }}
        />
      ) : (
        <span style={{ fontSize: 13, fontWeight: 600, color, whiteSpace: 'nowrap' }}>
          {data.label}
        </span>
      )}
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

function MindMapInner() {
  const { mindMapNodes, mindMapEdges, setMindMapNodes, setMindMapEdges } = useStore()
  const { fitView } = useReactFlow()

  const nodes: Node[] = mindMapNodes.map(n => ({
    ...n, type: 'custom', data: n.data,
  }))

  const edges: Edge[] = mindMapEdges.map(e => ({
    ...e,
    type: 'smoothstep',
    style: { stroke: '#3a3358', strokeWidth: 1.5 },
    animated: false,
  }))

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes)
      setMindMapNodes(updated.map(n => ({
        id: n.id, type: n.type, position: n.position,
        data: n.data as { label: string; color?: string },
      })))
    },
    [nodes, setMindMapNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated = applyEdgeChanges(changes, edges)
      setMindMapEdges(updated.map(e => ({ id: e.id, source: e.source, target: e.target })))
    },
    [edges, setMindMapEdges]
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges)
      setMindMapEdges(newEdges.map(e => ({ id: e.id, source: e.source, target: e.target })))
    },
    [edges, setMindMapEdges]
  )

  const addNode = () => {
    const id = generateId()
    const colors = ['#a78bfa', '#fbbf24', '#60a5fa', '#34d399']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const newNode = {
      id,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
      data: { label: 'new concept', color },
    }
    setMindMapNodes([...mindMapNodes, newNode])
  }

  const clearAll = () => {
    if (confirm('clear all nodes?')) {
      setMindMapNodes([])
      setMindMapEdges([])
    }
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {/* Toolbar */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        display: 'flex',
        gap: 8,
        background: '#19152a',
        border: '1px solid #2e2846',
        borderRadius: 13,
        padding: '8px 10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <button className="btn-primary" onClick={addNode} style={{ padding: '6px 14px', fontSize: 13 }}>
          <Plus size={14} /> add node
        </button>
        <button className="btn-ghost" onClick={() => fitView({ duration: 400 })} style={{ padding: '6px 10px' }} title="fit view">
          <Maximize2 size={14} />
        </button>
        <button
          className="btn-ghost"
          onClick={clearAll}
          style={{ padding: '6px 10px', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f87171' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.3)' }}
          title="clear all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Hint */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: 'rgba(17,14,28,0.85)',
        border: '1px solid #2e2846',
        borderRadius: 20,
        padding: '6px 16px',
        fontSize: 11.5,
        color: '#4d4468',
        backdropFilter: 'blur(8px)',
        whiteSpace: 'nowrap',
      }}>
        drag nodes · connect between handles · double-click to rename · delete key to remove
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        style={{ background: '#0b0914' }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#2e2846" />
        <Controls style={{ bottom: 60, right: 16, left: 'auto', top: 'auto' }} />
        <MiniMap
          style={{ bottom: 60, right: 110 }}
          nodeColor={n => getNodeColor(n.id, n.data as { color?: string })}
          maskColor="rgba(11,9,20,0.7)"
        />
      </ReactFlow>
    </div>
  )
}

export default function MindMap() {
  return (
    <ReactFlowProvider>
      <div style={{ height: '100%', width: '100%' }}>
        <MindMapInner />
      </div>
    </ReactFlowProvider>
  )
}
