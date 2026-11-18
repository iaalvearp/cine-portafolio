import { peliculas, type Pelicula } from './peliculas';
import { salas, type Sala } from './salas';
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

interface Horario {
    time: string;
    format: string;
    salaId: number;
    price: number;
}

const HORARIOS: Record<number, Horario[]> = {
    1: [
        { time: '10:30', format: '2D', salaId: 1, price: 6.50 },
        { time: '12:55', format: 'IMAX', salaId: 2, price: 10.50 },
        { time: '11:25', format: '4D', salaId: 4, price: 11.25 },
    ],
    2: [
        { time: '13:20', format: '2D', salaId: 1, price: 6.50 },
        { time: '16:00', format: '3D', salaId: 2, price: 8.50 },
        { time: '19:10', format: 'ATMOS', salaId: 3, price: 12.00 },
    ],
    3: [
        { time: '11:00', format: '2D', salaId: 1, price: 6.50 },
        { time: '15:30', format: '3D', salaId: 2, price: 8.50 },
    ],
    4: [
        { time: '12:00', format: '2D', salaId: 1, price: 6.50 },
        { time: '18:00', format: '2D', salaId: 2, price: 6.50 },
    ],
    5: [
        { time: '13:45', format: '2D', salaId: 1, price: 6.50 },
        { time: '17:20', format: 'IMAX', salaId: 2, price: 10.50 },
    ],
};

const FILAS_NORMAL = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const FILAS_VIP = ['A', 'B', 'C', 'D'];
const COLUMNAS_NORMAL = 12;
const COLUMNAS_VIP = 6;
const DIAS = 7;

const pad = (value: number) => String(value).padStart(2, '0');

const fechaRelativa = (dia: number): string => {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    fecha.setDate(fecha.getDate() + dia);
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
};

const salaPorId = (id: number): Sala => salas.find(sala => sala.id === id) ?? salas[0];

const generarFunciones = (): Funcion[] => {
    const funciones: Funcion[] = [];

    for (let dia = 0; dia < DIAS; dia++) {
        peliculas.forEach((pelicula, indicePelicula) => {
            const horarios = HORARIOS[pelicula.id] ?? [];

            horarios.forEach((horario, indiceHorario) => {
                funciones.push({
                    id: (dia * 1000) + (indicePelicula * 100) + (indiceHorario + 1),
                    movie: pelicula,
                    sala: salaPorId(horario.salaId),
                    date: fechaRelativa(dia),
                    time: horario.time,
                    format: horario.format,
                    language: 'ESP',
                    price: horario.price,
                    available: true,
                });
            });
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
