import { peliculas, type Pelicula } from './peliculas';
import { salas, type Sala } from './salas';
import { fechaRelativa } from './fechas';
import { usuarioInvitado } from './usuarioInvitado';

export interface Funcion {
    id: number;
    movie: Pelicula;
    sala: Sala;
    date: string;
    time: string;
    format: string;
    language: string;
    price: number;
    available: boolean;
}

export interface Reserva {
    id: number;
    usuario: typeof usuarioInvitado;
    funcion: Funcion;
    seats: string[];
    total: number;
    bookingDate: string;
}

const HORARIOS = ['10:30', '13:15', '16:45', '19:30', '22:15'];
const PRECIOS: Record<string, number> = {
    '2D': 6.50,
    '3D': 8.50,
    IMAX: 10.50,
    '4D': 11.25,
    ATMOS: 12.00,
};
// Cada formato se proyecta en una sala preparada para él.
const SALA_POR_FORMATO: Record<string, number> = {
    '2D': 1,
    '3D': 6,
    IMAX: 5,
    '4D': 4,
    ATMOS: 7,
};

const FILAS_NORMAL = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const FILAS_VIP = ['A', 'B', 'C', 'D'];
const COLUMNAS_NORMAL = 12;
const COLUMNAS_VIP = 6;
const DIAS = 14;

const pad = (value: number) => String(value).padStart(2, '0');

const salaPorId = (id: number): Sala => salas.find(sala => sala.id === id) ?? salas[0];

const generarFunciones = (): Funcion[] => {
    const funciones: Funcion[] = [];

    for (let dia = 0; dia < DIAS; dia++) {
        peliculas.forEach(pelicula => {
            const formatos = pelicula.formats.length > 0 ? pelicula.formats : ['2D'];
            const cantidad = Math.min(3, Math.max(2, formatos.length));

            for (let indiceHorario = 0; indiceHorario < cantidad; indiceHorario++) {
                const formato = formatos[indiceHorario % formatos.length];
                const salaId = formato === '2D' && indiceHorario % 2 === 1
                    ? 2
                    : SALA_POR_FORMATO[formato] ?? 1;

                funciones.push({
                    id: (dia + 1) * 1000 + pelicula.id * 10 + indiceHorario + 1,
                    movie: pelicula,
                    sala: salaPorId(salaId),
                    date: fechaRelativa(dia),
                    time: HORARIOS[(pelicula.id + indiceHorario * 2) % HORARIOS.length],
                    format: formato,
                    language: 'ESP',
                    price: PRECIOS[formato] ?? 6.50,
                    available: true,
                });
            }
        });
    }

    return funciones;
};

export const funciones: Funcion[] = generarFunciones();

const asientosOcupados = (funcion: Funcion): string[] => {
    const esVip = funcion.sala.type.toUpperCase().includes('VIP');
    const filas = esVip ? FILAS_VIP : FILAS_NORMAL;
    const columnas = esVip ? COLUMNAS_VIP : COLUMNAS_NORMAL;
    const totalAsientos = filas.length * columnas;
    const cantidad = 8 + ((funcion.id * 7) % 13);
    const inicio = (funcion.id * 11) % (totalAsientos - cantidad + 1);

    return Array.from({ length: cantidad }, (_, indice) => {
        const posicion = (inicio + indice) % totalAsientos;
        return `${filas[Math.floor(posicion / columnas)]}${(posicion % columnas) + 1}`;
    });
};

const generarReservas = (): Reserva[] => funciones.map(funcion => {
    const seats = asientosOcupados(funcion);
    const hora = 9 + (funcion.id % 10);
    const minuto = funcion.id % 60;

    return {
        id: 10000 + funcion.id,
        usuario: usuarioInvitado,
        funcion,
        seats,
        total: Number((seats.length * funcion.price).toFixed(2)),
        bookingDate: `${funcion.date}T${pad(hora)}:${pad(minuto)}:00`,
    };
});

export const reservas: Reserva[] = generarReservas();
