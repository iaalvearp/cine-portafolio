import type { Movie } from '@/modules/cartelera/types/Movie';
import { API_ENDPOINTS } from '@/config/api';
import { apiFetch } from '@/lib/localApi';

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

    return {
        id: String(backendMovie.id),
        title: backendMovie.title,
        poster: posterPath,
        backdrop: backdropPath,
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

/**
 * Servicio para obtener las películas desde la API local.
 */
export const movieService = {
    getMovies: async (): Promise<Movie[]> => {
        try {
            const response = await apiFetch(API_ENDPOINTS.PELICULAS);

            if (!response.ok) {
                throw new Error(`Error fetching movies: ${response.statusText}`);
            }

            const data: BackendMovie[] = await response.json();
            return data.map(adaptMovie);
        } catch (error) {
            console.error('Error in movieService.getMovies:', error);
            throw error;
        }
    },
};
