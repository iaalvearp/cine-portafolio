export interface Sala {
    id: number;
    name: string;
    type: string;
    capacity: number;
    cinemaId: number;
}

export const salas: Sala[] = [
    { id: 1, name: 'Sala 1', type: 'Normal', capacity: 100, cinemaId: 2 },
    { id: 2, name: 'Sala 2', type: 'Normal', capacity: 100, cinemaId: 2 },
    { id: 3, name: 'Sala VIP', type: 'VIP', capacity: 50, cinemaId: 2 },
    { id: 4, name: 'Sala 4D', type: '4D', capacity: 60, cinemaId: 2 },
];
