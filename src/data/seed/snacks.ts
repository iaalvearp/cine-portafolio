export interface Snack {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

const IMAGEN = '/images/snacks/placeholder.svg';

export const snacks: Snack[] = [
    { id: 1, name: 'Combo Clásico', description: 'Popcorn grande + 2 bebidas', price: 12.50, category: 'combos', image: IMAGEN },
    { id: 2, name: 'Combo Familiar', description: '2 Popcorn grandes + 4 bebidas', price: 22.00, category: 'combos', image: IMAGEN },
    { id: 3, name: 'Combo Premium', description: 'Popcorn jumbo + nachos', price: 18.50, category: 'combos', image: IMAGEN },
    { id: 4, name: 'Combo Duo', description: '2 Popcorn medianos', price: 15.00, category: 'combos', image: IMAGEN },
    { id: 5, name: 'Popcorn Pequeño', description: 'Palomitas recién hechas', price: 4.50, category: 'popcorn', image: IMAGEN },
    { id: 6, name: 'Popcorn Mediano', description: 'Palomitas recién hechas', price: 6.00, category: 'popcorn', image: IMAGEN },
    { id: 7, name: 'Popcorn Grande', description: 'Palomitas recién hechas', price: 7.50, category: 'popcorn', image: IMAGEN },
    { id: 8, name: 'Popcorn Jumbo', description: 'Tamaño familiar', price: 9.00, category: 'popcorn', image: IMAGEN },
    { id: 9, name: 'Nachos con Queso', description: 'Con queso cheddar caliente', price: 6.50, category: 'snacks', image: IMAGEN },
    { id: 10, name: 'Hot Dog', description: 'Con salchicha premium', price: 4.50, category: 'snacks', image: IMAGEN },
    { id: 11, name: 'Pizza Personal', description: 'De pepperoni', price: 5.50, category: 'snacks', image: IMAGEN },
    { id: 12, name: 'Nuggets', description: '6 unidades', price: 5.00, category: 'snacks', image: IMAGEN },
    { id: 13, name: 'Bebida Mediana', description: 'Gaseosa', price: 3.50, category: 'bebidas', image: IMAGEN },
    { id: 14, name: 'Bebida Grande', description: 'Gaseosa', price: 4.50, category: 'bebidas', image: IMAGEN },
    { id: 15, name: 'Agua Mineral', description: '500ml', price: 2.50, category: 'bebidas', image: IMAGEN },
    { id: 16, name: 'ICEE', description: 'Cereza o uva', price: 5.00, category: 'bebidas', image: IMAGEN },
    { id: 17, name: "M&M's", description: 'Clásicos', price: 3.50, category: 'dulces', image: IMAGEN },
    { id: 18, name: 'Skittles', description: 'Frutales', price: 3.00, category: 'dulces', image: IMAGEN },
    { id: 19, name: 'Gomitas', description: 'Surtidas', price: 3.00, category: 'dulces', image: IMAGEN },
    { id: 20, name: 'Chocolate', description: 'Con leche', price: 3.50, category: 'dulces', image: IMAGEN },
];
