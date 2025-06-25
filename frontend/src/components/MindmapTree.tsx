import React from 'react';
import { MindmapNode } from '../models/MindmapNode';

interface MindmapTreeProps {
    nodes: MindmapNode[];
    parentId?: string | null;
    onAddNode: (newNode: { title: string; content: string; parentId: string | null }) => void;
    onDeleteNode: (id: string) => void;
    onEditNode: (id: string, title: string, content: string) => void;
}


const MindmapTree: React.FC<MindmapTreeProps> = ({ nodes, parentId = null, onAddNode, onDeleteNode, onEditNode}) => {
    const children = nodes.filter(node => node.parentId === parentId);

    return (
        <ul className="tree">
            {children.map(child => (
                <li key={child.id}>
                <div className="tree-node">
                    <strong>{child.title}</strong>
                    <p>{child.content}</p>
                    <small>ID: {child.id}</small>
                    <button onClick={() => {
                    const title = prompt("Enter child node title: ");
                    const content = prompt("Enter child node content: ");
                    if (title && content) {
                        onAddNode({
                        title,
                        content,
                        parentId: child.id ?? null
                        });
                    }
                    }}>➕ Add Child</button>
                    {child.id && (
                        <button onClick={() => onDeleteNode(child.id!)}>🗑️ Delete</button>
                    )}
                    <button onClick={() => {
                        const newTitle = prompt("Edit title: ", child.title);
                        const newContent = prompt("Edit content: ", child.content);
                        if(newTitle && newContent) {
                            onEditNode(child.id!, newTitle, newContent);
                        }
                    }}>✏️ Edit</button>
                </div>
                <MindmapTree 
                    nodes={nodes} 
                    parentId={child.id} 
                    onAddNode={onAddNode} 
                    onDeleteNode={onDeleteNode}
                    onEditNode = {onEditNode}
                    />
                </li>
            ))}
        </ul>

    );
};

export default MindmapTree;
