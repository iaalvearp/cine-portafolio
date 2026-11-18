import type { Movie } from '@/modules/cartelera/types/Movie';
import { API_ENDPOINTS } from '@/config/api';
import { apiFetch } from '@/lib/localApi';

const CLAVE_CACHE = 'cine_peliculas_cache';

// Estructura que devuelve la API local (idéntica a la del proyecto Spring Boot).
interface BackendMovie {
    id: number | string;
    title: string;
    synopsis: string;
    director: string;
    duration: string;
    rating: string;
    poster: string;
    backdrop: string;
    fondo?: string;
    genre: string[];
    cast: string[];
    formats: string[];
    anio: number;
    /** Fecha ISO calculada en el seed; se conserva `anio` para backend antiguos. */
    releaseDate?: string;
    preSale: boolean;
}

/**
 * Adaptador para transformar una película del backend al formato del frontend.
 */
const adaptMovie = (backendMovie: BackendMovie): Movie => {
    // Las rutas del seed ya empiezan con /images/... y funcionan tal cual en public/.
    let posterPath = backendMovie.poster;
    if (posterPath && !posterPath.startsWith('http') && !posterPath.startsWith('/')) {
        posterPath = `/${posterPath}`;
    }

    let backdropPath = backendMovie.backdrop || '';
    if (backdropPath && !backdropPath.startsWith('http') && !backdropPath.startsWith('/')) {
        backdropPath = `/${backdropPath}`;
    }

    // Si el backend aún no envía `fondo`, se usa la propia portada como respaldo.
    let fondoPath = backendMovie.fondo || posterPath;
    if (fondoPath && !fondoPath.startsWith('http') && !fondoPath.startsWith('/')) {
        fondoPath = `/${fondoPath}`;
    }

    return {
        id: String(backendMovie.id),
        title: backendMovie.title,
        poster: posterPath,
        backdrop: backdropPath,
        fondo: fondoPath,
        duration: backendMovie.duration,
        rating: backendMovie.rating,
        genre: backendMovie.genre,
        synopsis: backendMovie.synopsis,
        director: backendMovie.director,
        cast: backendMovie.cast,
        releaseDate: backendMovie.releaseDate || String(backendMovie.anio),
        language: 'ESP',
        format: backendMovie.formats,
        isPreSale: backendMovie.preSale || false,
    };
};

const leerCache = (): Movie[] | null => {
    try {
        const guardado = window.sessionStorage.getItem(CLAVE_CACHE);
        if (!guardado) return null;
        const datos = JSON.parse(guardado);
        // Descartar cachés anteriores al campo `fondo` para volver a pedir los datos.
        if (Array.isArray(datos) && datos.length > 0 && !('fondo' in datos[0])) return null;
        return Array.isArray(datos) ? datos as Movie[] : null;
    } catch {
        return null;
    }
};

const guardarCache = (peliculas: Movie[]) => {
    try {
        window.sessionStorage.setItem(CLAVE_CACHE, JSON.stringify(peliculas));
    } catch {
        // La caché es opcional: la demo sigue funcionando sin almacenamiento.
    }
};

/** Películas disponibles de forma síncrona para pintar sin esperar al fetch. */
export const getMoviesCache = (): Movie[] | null => leerCache();

// Promesa compartida por todos los componentes: una sola petición por carga de página.
let promesaPeliculas: Promise<Movie[]> | null = null;

const cargarPeliculas = async (): Promise<Movie[]> => {
    const response = await apiFetch(API_ENDPOINTS.PELICULAS);

    if (!response.ok) {
        throw new Error(`Error fetching movies: ${response.statusText}`);
    }

    const data: BackendMovie[] = await response.json();
    const peliculas = data.map(adaptMovie);
    guardarCache(peliculas);
    return peliculas;
};

/**
 * Servicio para obtener las películas desde la API local.
 * La promesa en curso se comparte entre llamadores y se reutiliza mientras viva el módulo.
 */
export const movieService = {
    getMovies: (): Promise<Movie[]> => {
        if (!promesaPeliculas) {
            const enCache = leerCache();
            promesaPeliculas = enCache
                ? Promise.resolve(enCache)
                : cargarPeliculas().catch((error) => {
                    promesaPeliculas = null; // Permite reintentar tras un fallo.
                    throw error;
                });
        }
        return promesaPeliculas;
    },
};
