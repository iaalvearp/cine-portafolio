export interface Snack {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

const IMG = {
    combo: '/images/snacks/combo.svg',
    palomitas: '/images/snacks/palomitas.svg',
    nachos: '/images/snacks/nachos.svg',
    hotdog: '/images/snacks/hotdog.svg',
    pizza: '/images/snacks/pizza.svg',
    nuggets: '/images/snacks/nuggets.svg',
    bebida: '/images/snacks/bebida.svg',
    agua: '/images/snacks/agua.svg',
    icee: '/images/snacks/icee.svg',
    dulce: '/images/snacks/dulce.svg',
    chocolate: '/images/snacks/chocolate.svg',
};

export const snacks: Snack[] = [
    { id: 1, name: 'Combo Clásico', description: 'Popcorn grande + 2 bebidas', price: 12.50, category: 'combos', image: IMG.combo },
    { id: 2, name: 'Combo Familiar', description: '2 Popcorn grandes + 4 bebidas', price: 22.00, category: 'combos', image: IMG.combo },
    { id: 3, name: 'Combo Premium', description: 'Popcorn jumbo + nachos', price: 18.50, category: 'combos', image: IMG.combo },
    { id: 4, name: 'Combo Duo', description: '2 Popcorn medianos', price: 15.00, category: 'combos', image: IMG.combo },
    { id: 5, name: 'Popcorn Pequeño', description: 'Palomitas recién hechas', price: 4.50, category: 'popcorn', image: IMG.palomitas },
    { id: 6, name: 'Popcorn Mediano', description: 'Palomitas recién hechas', price: 6.00, category: 'popcorn', image: IMG.palomitas },
    { id: 7, name: 'Popcorn Grande', description: 'Palomitas recién hechas', price: 7.50, category: 'popcorn', image: IMG.palomitas },
    { id: 8, name: 'Popcorn Jumbo', description: 'Tamaño familiar', price: 9.00, category: 'popcorn', image: IMG.palomitas },
    { id: 9, name: 'Nachos con Queso', description: 'Con queso cheddar caliente', price: 6.50, category: 'snacks', image: IMG.nachos },
    { id: 10, name: 'Hot Dog', description: 'Con salchicha premium', price: 4.50, category: 'snacks', image: IMG.hotdog },
    { id: 11, name: 'Pizza Personal', description: 'De pepperoni', price: 5.50, category: 'snacks', image: IMG.pizza },
    { id: 12, name: 'Nuggets', description: '6 unidades', price: 5.00, category: 'snacks', image: IMG.nuggets },
    { id: 13, name: 'Bebida Mediana', description: 'Gaseosa', price: 3.50, category: 'bebidas', image: IMG.bebida },
    { id: 14, name: 'Bebida Grande', description: 'Gaseosa', price: 4.50, category: 'bebidas', image: IMG.bebida },
    { id: 15, name: 'Agua Mineral', description: '500ml', price: 2.50, category: 'bebidas', image: IMG.agua },
    { id: 16, name: 'ICEE', description: 'Cereza o uva', price: 5.00, category: 'bebidas', image: IMG.icee },
    { id: 17, name: "M&M's", description: 'Clásicos', price: 3.50, category: 'dulces', image: IMG.dulce },
    { id: 18, name: 'Skittles', description: 'Frutales', price: 3.00, category: 'dulces', image: IMG.dulce },
    { id: 19, name: 'Gomitas', description: 'Surtidas', price: 3.00, category: 'dulces', image: IMG.dulce },
    { id: 20, name: 'Chocolate', description: 'Con leche', price: 3.50, category: 'dulces', image: IMG.chocolate },
];
