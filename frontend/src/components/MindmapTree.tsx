import React from 'react';
import { MindmapNode } from '../models/MindmapNode';

interface MindmapTreeProps {
    nodes: MindmapNode[];
    parentId?: string | null;
    onAddNode: (newNode: { title: string; content: string; parentId: string | null }) => void;
}

const MindmapTree: React.FC<MindmapTreeProps> = ({ nodes, parentId = null, onAddNode }) => {
    const children = nodes.filter(node => node.parentId === parentId);

    return (
        <ul className="tree">
            {children.map(child => (
                <li key={child.id}>
                    <div className="node-box">
                        <strong>{child.title}</strong>
                        <p>{child.content}</p>
                        <small>ID: {child.id}</small>
                        <button
                            onClick={() => {
                                const title = prompt("Enter child node title:");
                                const content = prompt("Enter child node content:");
                                if (title && content) {
                                    onAddNode({ title, content, parentId: child.id ?? null });
                                }
                            }}
                        >
                            ➕ Add Child
                        </button>
                    </div>
                    <MindmapTree nodes={nodes} parentId={child.id} onAddNode={onAddNode} />
                </li>
            ))}
        </ul>
    );
};

export default MindmapTree;
