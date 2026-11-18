export interface Pelicula {
    id: number;
    title: string;
    synopsis: string;
    director: string;
    duration: string;
    rating: string;
    poster: string;
    backdrop: string;
    genre: string[];
    cast: string[];
    formats: string[];
    anio: number;
    preSale: boolean;
}

export const peliculas: Pelicula[] = [
    {
        id: 1,
        title: 'Gladiador II',
        synopsis: 'Años después...',
        director: 'Ridley Scott',
        duration: '2h 28m',
        rating: '+16',
        poster: '/images/portadas/gladiador-min.webp',
        backdrop: '/images/banner/gladiador-banner.webp',
        genre: ['Acción', 'Aventura', 'Drama'],
        cast: ['Paul Mescal', 'Pedro Pascal'],
        formats: ['2D', 'IMAX', '4D'],
        anio: 2024,
        preSale: false,
    },
    {
        id: 2,
        title: 'Wicked',
        synopsis: 'La historia no contada...',
        director: 'Jon M. Chu',
        duration: '2h 40m',
        rating: 'TP',
        poster: '/images/portadas/wicked-min.webp',
        backdrop: '/images/banner/wicked-banner.webp',
        genre: ['Fantasía', 'Musical'],
        cast: ['Ariana Grande'],
        formats: ['2D', '3D', 'ATMOS'],
        anio: 2024,
        preSale: false,
    },
    {
        id: 3,
        title: 'Moana 2',
        synopsis: 'Tras recibir una llamada...',
        director: 'David G.',
        duration: '1h 40m',
        rating: 'TP',
        poster: '/images/portadas/moana-min.webp',
        backdrop: '/images/banner/moana-banner.webp',
        genre: ['Animación', 'Aventura'],
        cast: ['La Roca'],
        formats: ['2D', '3D'],
        anio: 2024,
        preSale: true,
    },
    {
        id: 4,
        title: 'Sonic 3: La Película',
        synopsis: 'Sonic, Knuckles y Tails...',
        director: 'Jeff Fowler',
        duration: '1h 49m',
        rating: 'TP',
        poster: '/images/portadas/sonic-min.webp',
        backdrop: '/images/banner/sonic-banner.webp',
        genre: ['Acción', 'Aventura'],
        cast: ['Jim Carrey'],
        formats: ['2D'],
        anio: 2024,
        preSale: true,
    },
    {
        id: 5,
        title: 'Mufasa: El Rey León',
        synopsis: 'Rafiki cuenta...',
        director: 'Barry Jenkins',
        duration: '1h 58m',
        rating: 'TP',
        poster: '/images/portadas/rey_leon-min.webp',
        backdrop: '/images/banner/rey_leon-banner.webp',
        genre: ['Aventura'],
        cast: ['Aaron Pierre'],
        formats: ['2D', 'IMAX'],
        anio: 2024,
        preSale: true,
    },
];
