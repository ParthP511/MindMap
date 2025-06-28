import React from 'react';
import { MindmapNode } from '../models/MindmapNode';


interface MindmapTreeProps {
    nodes: MindmapNode[];
    parentId?: string | null;
    onAddNode: (newNode: { title: string; content: string; parentId: string | null }) => void;
    onDeleteNode: (id: string) => void;
    onEditNode: (id: string, title: string, content: string) => void;
    onMoveNode: (draggedId: string, targetId: string | null) => void;
}


const MindmapTree: React.FC<MindmapTreeProps> = ({ 
    nodes, 
    parentId = null, 
    onAddNode, 
    onDeleteNode, 
    onEditNode, 
    onMoveNode}) => {
    const children = nodes.filter(node => node.parentId === parentId);

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, draggedId: string) => {
        console.log("Drag started: draggedId = ", draggedId);
        e.dataTransfer.setData("text/plain", draggedId);
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetId: string | null) => {
        console.log("Drop fired: " ,"target Id = ", targetId);
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text/plain");
        if (draggedId && draggedId !== targetId && onMoveNode) {
            onMoveNode(draggedId, targetId);
        }
    };

    const allowDrop = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
    };

    return (
        <ul className="tree">
            {children.map(child => (
                <li 
                    key={child.id}
                    draggable
                    onDragStart={(e) => {
                        e.stopPropagation();
                        if(child.id) {
                            // console.log('conosle setting child node',child.id)
                            e.dataTransfer.setData("text/plain", child.id);
                        }
                    }}
                    
                    onDragOver = {(e) => {e.preventDefault()
                  }

                    }
                    onDrop={(e) => {
                        e.stopPropagation();
                        const childId = e.dataTransfer.getData('text/plain');
                        const targetId = child.id
                        console.log('target->>>',targetId,"child->>>",childId)
                        if(targetId && childId !== child.id) {
                            onMoveNode(targetId, childId ?? null);
                        }
                        return;
                    }
                }
                >
                <div className="tree-node" >
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
                    onMoveNode = {onMoveNode}
                    />
                </li>
            ))}
        </ul>
    );
};

export default MindmapTree;
