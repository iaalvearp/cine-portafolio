export interface Promocion {
    id: number;
    title: string;
    description: string;
    discount: string;
    validity: string;
    image: string;
}

export const promociones: Promocion[] = [
    { id: 1, title: 'Martes de Cine', description: '$5.00', discount: '50% OFF', validity: 'Martes', image: '🎬' },
    { id: 2, title: 'Combo Estudiante', description: 'Carnet', discount: '30% OFF', validity: 'Todo el año', image: '📚' },
    { id: 3, title: 'Happy Hour', description: 'Antes 15:00', discount: '40% OFF', validity: 'Lun-Vie', image: '☀️' },
    { id: 4, title: 'Pack Navideño', description: '4 entradas', discount: 'ESPECIAL', validity: 'Dic', image: '🎄' },
];
