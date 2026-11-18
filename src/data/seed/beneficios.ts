export interface Beneficio {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const beneficios: Beneficio[] = [
    { id: 1, title: 'CineFan Club', description: 'Acumula puntos...', icon: 'star', color: 'yellow' },
    { id: 2, title: '2x1 en Entradas', description: 'Martes...', icon: 'ticket', color: 'green' },
    { id: 3, title: 'Cumpleaños Gratis', description: 'Regalo...', icon: 'gift', color: 'pink' },
    { id: 4, title: 'Descuento Familiar', description: 'Grupos...', icon: 'users', color: 'blue' },
];
