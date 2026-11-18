export interface TipoEntrada {
    id: number;
    name: string;
    price: number;
    description: string;
}

export const tiposEntrada: TipoEntrada[] = [
    { id: 1, name: 'General', price: 6.50, description: 'Estándar' },
    { id: 2, name: 'Niños / 3ra Edad', price: 3.25, description: 'Descuento' },
    { id: 3, name: 'VIP', price: 12.00, description: 'Reclinable' },
    { id: 4, name: 'IMAX', price: 10.50, description: 'Gigante' },
    { id: 5, name: '4D', price: 11.25, description: 'Movimiento' },
];
