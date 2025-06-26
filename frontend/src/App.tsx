import React, {useEffect, useState} from "react";
import MindmapTree from "./components/MindmapTree";
import { MindmapNode } from "./models/MindmapNode";

const App: React.FC = () => {
    const [nodes, setNodes] = useState<MindmapNode[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [parentId, setParentId] = useState<string | null>(null);

    const fetchNodes = () => {
        fetch('/api/nodes')
            .then(res => res.json())
            .then(data => setNodes(data))
            .catch(err => console.error('Failed to fetch nodes: ', err));
    };

    useEffect(() => {
        fetchNodes();
    }, []);

    const handleFormSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const newNode = {title, content, parentId: parentId || null};
        await fetch('/api/nodes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newNode)
        });

        setTitle('');
        setContent('');
        setParentId(null);
        fetchNodes();
    };

    const handleAddNode = (newNode: {title: string; content: string; parentId: string | null}) => {
        fetch('/api/nodes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newNode)
        })
        .then(() => fetchNodes());
    };

    const handleDeleteNode = async(id: string) => {
        await fetch(`/api/nodes/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchNodes())
        .catch(err => console.error('Failed to delete node: ', err));
    };

    const handleEditNode = (id: string, title: string, content: string) => {
        fetch(`/api/nodes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                title,
                content,
                parentId: null // Assuming parentId is not edited. This might change when we add drag and drop feature.
            })
        })
        .then(() => fetchNodes())
        .catch((err) => console.error('Failed to edit node: ', err));
    };
    
    const handleMoveNode = (draggedId: string, targetId: string | null) => {
        console.log("Calling API to move: ", draggedId, "->", targetId);
        fetch(`/api/nodes/${draggedId}/move`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ parentId: targetId })
        })
        .then(() => {
            console.log("Refetching nodes...");
            fetchNodes();
        });
    }

    return (
        <div style = {{ padding: '2rem'}}>
            <h1>MindMap Viewer</h1>

            <form onSubmit={handleFormSubmit} style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input 
                    type="text"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <input 
                    type="text"
                    placeholder="Parent ID (optional)"
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value || null)}
                />
                <button type="submit">Add Node</button>
            </form>
            <MindmapTree 
                nodes={nodes} 
                onAddNode = {handleAddNode} 
                onDeleteNode = {handleDeleteNode} 
                onEditNode = {handleEditNode}
                onMoveNode = {handleMoveNode}/>
        </div>
    );
};


export default App;