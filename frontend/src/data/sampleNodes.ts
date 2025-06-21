import { MindmapNode } from '../models/MindmapNode';

export const sampleNodes: MindmapNode[] = [
    {
        id: '1',
        title: 'Root',
        content: 'RootNode',
        parentId: null
    },
    {
        id: '2',
        title: 'child A',
        content: 'First Child',
        parentId: '1'
    }, 
    {
        id: '3',
        title: 'Child B',
        content: 'Second Child',
        parentId: '1'
    },
    {
        id: '4',
        title: 'Grandchild A1',
        content: 'First GrandChild',
        parentId: '2'
    }
];