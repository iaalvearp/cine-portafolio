export interface Formato {
    id: number;
    name: string;
}

export const formatos: Formato[] = [
    { id: 1, name: '2D' },
    { id: 2, name: '3D' },
    { id: 3, name: 'IMAX' },
    { id: 4, name: '4D' },
    { id: 5, name: 'ATMOS' },
];
