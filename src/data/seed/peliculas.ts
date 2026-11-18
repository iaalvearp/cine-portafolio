import { fechaRelativa } from './fechas';

export interface Pelicula {
    id: number;
    title: string;
    synopsis: string;
    director: string;
    duration: string;
    rating: string;
    poster: string;
    backdrop: string;
    fondo: string;
    genre: string[];
    cast: string[];
    formats: string[];
    anio: number;
    /** Estreno ISO (yyyy-MM-dd) calculado en tiempo de ejecución respecto a hoy. */
    releaseDate: string;
    preSale: boolean;
}

type PeliculaBase = Omit<Pelicula, 'anio' | 'releaseDate'>;

// Cartelera: estrenos entre hace 30 y hace 3 días. Preventa: entre 5 y 20 días en el futuro.
const DIAS_CARTELERA = [-3, -6, -9, -12, -15, -18, -21, -25, -30];
const DIAS_PREVENTA = [5, 8, 12, 16, 20];

const base: PeliculaBase[] = [
    {
        id: 1,
        title: 'Gladiador II',
        synopsis: 'Años después...',
        director: 'Ridley Scott',
        duration: '2h 28m',
        rating: '+16',
        poster: '/images/portadas/gladiador-min.webp',
        backdrop: '/images/banner/gladiador-banner.webp',
        fondo: '/images/banner/gladiador-banner.webp',
        genre: ['Acción', 'Aventura', 'Drama'],
        cast: ['Paul Mescal', 'Pedro Pascal'],
        formats: ['2D', 'IMAX', '4D'],
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
        fondo: '/images/fondos/wicked-fondo.webp',
        genre: ['Fantasía', 'Musical'],
        cast: ['Ariana Grande'],
        formats: ['2D', '3D', 'ATMOS'],
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
        fondo: '/images/banner/moana-banner.webp',
        genre: ['Animación', 'Aventura'],
        cast: ['La Roca'],
        formats: ['2D', '3D'],
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
        fondo: '/images/banner/sonic-banner.webp',
        genre: ['Acción', 'Aventura'],
        cast: ['Jim Carrey'],
        formats: ['2D'],
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
        fondo: '/images/banner/rey_leon-banner.webp',
        genre: ['Aventura'],
        cast: ['Aaron Pierre'],
        formats: ['2D', 'IMAX'],
        preSale: true,
    },
    {
        id: 6,
        title: 'Avatar: Fuego y Ceniza',
        synopsis: 'La familia de Jake y Neytiri se enfrenta a los Ash en una Pandora en llamas.',
        director: 'James Cameron',
        duration: '3h 35m',
        rating: '+12',
        poster: '/images/portadas/avatar-min.webp',
        backdrop: '/images/banner/avatar-banner.webp',
        fondo: '/images/fondos/avatar-fondo.webp',
        genre: ['Aventura', 'Ciencia Ficción', 'Acción'],
        cast: ['Sam Worthington', 'Zoe Saldaña', 'Kate Winslet'],
        formats: ['2D', '3D', 'IMAX', '4D'],
        preSale: true,
    },
    {
        id: 7,
        title: 'Anaconda',
        synopsis: 'Una expedición a la selva descubre una serpiente gigante que acecha a la tripulación.',
        director: 'Luis Herrera',
        duration: '2h 00m',
        rating: '+16',
        poster: '/images/portadas/anaconda-min.webp',
        backdrop: '/images/banner/avatar-banner.webp',
        fondo: '/images/fondos/anaconda-fondo.webp',
        genre: ['Aventura', 'Terror'],
        cast: ['Jennifer López', 'Ice Cube'],
        formats: ['2D', '4D'],
        preSale: false,
    },
    {
        id: 8,
        title: 'Bob Esponja: La gran aventura',
        synopsis: 'Bob Esponja y Patricio viajan a la superficie para recuperar la esponja perdida.',
        director: 'Paul Tibbitt',
        duration: '1h 35m',
        rating: 'TP',
        poster: '/images/portadas/bob_esponja-min.webp',
        backdrop: '/images/banner/moana-banner.webp',
        fondo: '/images/fondos/bob_esponja-fondo.webp',
        genre: ['Animación', 'Comedia', 'Familiar'],
        cast: ['Tom Kenny', 'Bill Fagerbakke'],
        formats: ['2D', '3D'],
        preSale: false,
    },
    {
        id: 9,
        title: 'Bogonia',
        synopsis: 'Unos hongos diminutos emprenden un viaje subterráneo para salvar su hogar.',
        director: 'Marta Solís',
        duration: '1h 42m',
        rating: 'TP',
        poster: '/images/portadas/bogonia-min.webp',
        backdrop: '/images/banner/sonic-banner.webp',
        fondo: '/images/fondos/bogonia-fondo.webp',
        genre: ['Animación', 'Fantasía'],
        cast: ['Lucía Vega', 'Andrés Molina'],
        formats: ['2D', '3D'],
        preSale: false,
    },
    {
        id: 10,
        title: 'Freddy: Pesadillas en la escuela',
        synopsis: 'Un grupo de estudiantes descubre que un viejo muñeco acecha los pasillos de su escuela.',
        director: 'Pedro Alcalá',
        duration: '1h 49m',
        rating: '+16',
        poster: '/images/portadas/freddy-min.webp',
        backdrop: '/images/banner/gladiador-banner.webp',
        fondo: '/images/fondos/freddy-fondo.webp',
        genre: ['Terror', 'Suspenso'],
        cast: ['Mateo Ríos', 'Camila Torres'],
        formats: ['2D', '4D'],
        preSale: false,
    },
    {
        id: 11,
        title: 'Gran Premio',
        synopsis: 'Un piloto novato y un copiloto veterano se enfrentan al rally más peligroso del continente.',
        director: 'Ana Beltrán',
        duration: '2h 05m',
        rating: '+12',
        poster: '/images/portadas/gran_premio-min.webp',
        backdrop: '/images/banner/sonic-banner.webp',
        fondo: '/images/portadas/gran_premio-min.webp',
        genre: ['Acción', 'Drama', 'Deportes'],
        cast: ['Diego Ferrer', 'Renata Silva'],
        formats: ['2D', 'IMAX'],
        preSale: false,
    },
    {
        id: 12,
        title: 'Kraven el Cazador',
        synopsis: 'La historia de origen del cazador más temible de Marvel, entre la venganza y el destino.',
        director: 'J. C. Chandor',
        duration: '2h 10m',
        rating: '+16',
        poster: '/images/portadas/kraven-min.webp',
        backdrop: '/images/banner/gladiador-banner.webp',
        fondo: '/images/portadas/kraven-min.webp',
        genre: ['Acción', 'Thriller'],
        cast: ['Aaron Taylor-Johnson', 'Russell Crowe', 'Ariana DeBose'],
        formats: ['2D', 'IMAX'],
        preSale: true,
    },
    {
        id: 13,
        title: 'Una Navidad para recordar',
        synopsis: 'Dos hermanos separados se reencuentran en una pequeña ciudad decorada para la Navidad.',
        director: 'Elena Ruiz',
        duration: '1h 38m',
        rating: 'TP',
        poster: '/images/portadas/navidad-min.webp',
        backdrop: '/images/banner/wicked-banner.webp',
        fondo: '/images/portadas/navidad-min.webp',
        genre: ['Comedia', 'Romance', 'Familiar'],
        cast: ['Sofía Miranda', 'Pablo Castaño'],
        formats: ['2D'],
        preSale: false,
    },
    {
        id: 14,
        title: 'Stitch: El regreso',
        synopsis: 'Stitch vuelve a la Tierra y descubre que cuidar a una familia es su aventura más difícil.',
        director: 'Chris Sanders',
        duration: '1h 45m',
        rating: 'TP',
        poster: '/images/portadas/sticht-min.webp',
        backdrop: '/images/banner/moana-banner.webp',
        fondo: '/images/portadas/sticht-min.webp',
        genre: ['Animación', 'Comedia', 'Familiar'],
        cast: ['Daveigh Chase', 'Chris Sanders'],
        formats: ['2D', '3D'],
        preSale: false,
    },
];

export const peliculas: Pelicula[] = (() => {
    let enCartelera = 0;
    let enPreventa = 0;

    return base.map((pelicula) => {
        const indice = pelicula.preSale ? enPreventa++ : enCartelera++;
        const dias = pelicula.preSale
            ? DIAS_PREVENTA[indice % DIAS_PREVENTA.length]
            : DIAS_CARTELERA[indice % DIAS_CARTELERA.length];
        const releaseDate = fechaRelativa(dias);

        return {
            ...pelicula,
            anio: Number(releaseDate.slice(0, 4)),
            releaseDate,
        };
    });
})();
