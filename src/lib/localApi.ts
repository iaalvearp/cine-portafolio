import { API_ENDPOINTS } from '@/config/api';
import {
    beneficios,
    cines,
    ciudades,
    credencialesDemo,
    formatos,
    funciones,
    generos,
    peliculas,
    promociones,
    reservas,
    salas,
    snacks,
    tiposEntrada,
    usuarioInvitado,
    type Reserva,
} from '@/data/seed';

export const CLAVE_RESERVAS = 'cine_reservas';
export const MENSAJE_SIN_PERMISOS = 'No tienes permisos para esta función en la demo';

type Cuerpo = Record<string, any>;

export interface RespuestaLocal<T = any> {
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<T>;
}

const respuesta = <T>(status: number, datos: T, statusText = ''): RespuestaLocal<T> => ({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => datos,
});

const sinPermisos = (): RespuestaLocal => respuesta(403, {
    status: 'error',
    mensaje: MENSAJE_SIN_PERMISOS,
    message: MENSAJE_SIN_PERMISOS,
}, 'Forbidden');

const noEncontrado = (mensaje: string): RespuestaLocal => respuesta(404, {
    status: 'error',
    mensaje,
    message: mensaje,
}, 'Not Found');

const leerCuerpo = (opciones?: RequestInit): Cuerpo => {
    const cuerpo = opciones?.body;
    if (!cuerpo || typeof cuerpo !== 'string') return {};
    try {
        return JSON.parse(cuerpo) as Cuerpo;
    } catch {
        return {};
    }
};

const leerReservasVisitante = (): Reserva[] => {
    try {
        const guardado = localStorage.getItem(CLAVE_RESERVAS);
        if (!guardado) return [];
        const datos = JSON.parse(guardado);
        return Array.isArray(datos) ? datos as Reserva[] : [];
    } catch {
        return [];
    }
};

const guardarReservaVisitante = (reserva: Reserva): boolean => {
    try {
        const actuales = leerReservasVisitante();
        localStorage.setItem(CLAVE_RESERVAS, JSON.stringify([...actuales, reserva]));
        return true;
    } catch {
        return false;
    }
};

const login = (opciones?: RequestInit): RespuestaLocal => {
    const { email, password } = leerCuerpo(opciones);

    if (email === credencialesDemo.email && password === credencialesDemo.password) {
        return respuesta(200, {
            status: 'success',
            mensaje: `Bienvenido ${usuarioInvitado.nombre}`,
            nombre: usuarioInvitado.nombre,
            rol: usuarioInvitado.rol,
            id: usuarioInvitado.id,
        });
    }

    return respuesta(401, {
        status: 'error',
        mensaje: 'Credenciales incorrectas. Usa las credenciales de la demo.',
        nombre: null,
        rol: null,
        id: null,
    }, 'Unauthorized');
};

const crearReserva = (opciones?: RequestInit): RespuestaLocal => {
    const cuerpo = leerCuerpo(opciones);
    const funcionId = Number(cuerpo.funcion?.id ?? cuerpo.funcionId);
    const funcion = funciones.find(item => item.id === funcionId);

    if (!funcion) {
        return respuesta(400, {
            status: 'error',
            mensaje: 'No encontramos la función seleccionada.',
        }, 'Bad Request');
    }

    const seats: string[] = Array.isArray(cuerpo.seats)
        ? cuerpo.seats.map((seat: unknown) => String(seat))
        : [];

    if (seats.length === 0) {
        return respuesta(400, {
            status: 'error',
            mensaje: 'Selecciona al menos un asiento.',
        }, 'Bad Request');
    }

    const reserva: Reserva = {
        id: 20000 + Date.now(),
        usuario: usuarioInvitado,
        funcion,
        seats,
        total: Number(cuerpo.total) || 0,
        bookingDate: new Date().toISOString(),
    };

    if (!guardarReservaVisitante(reserva)) {
        return respuesta(500, {
            status: 'error',
            mensaje: 'No se pudo guardar la reserva en este navegador.',
        }, 'Internal Server Error');
    }

    return respuesta(201, reserva, 'Created');
};

const filtrarTiposEntrada = (tipoSala: string | null) => {
    if (!tipoSala) return tiposEntrada;

    const tipo = tipoSala.toUpperCase();
    const idsPorSala: Record<string, number[]> = {
        NORMAL: [1, 2],
        VIP: [3, 1, 2],
        IMAX: [4, 1, 2],
        '4D': [5, 1, 2],
        ATMOS: [3, 1, 2],
    };
    const ids = idsPorSala[tipo] ?? [1, 2];
    return tiposEntrada.filter(item => ids.includes(item.id));
};

/**
 * Adaptador local que imita la API REST del proyecto original.
 * Toda la información sale de src/data/seed y de localStorage.
 */
export const apiFetch = async (ruta: string, opciones?: RequestInit): Promise<RespuestaLocal> => {
    const url = new URL(ruta, 'http://cine-demo.local');
    const partes = url.pathname.split('/').filter(Boolean);
    const metodo = (opciones?.method ?? 'GET').toUpperCase();
    const coleccion = partes[1];

    const escrituraPermitida =
        (coleccion === 'reservas' && metodo === 'POST') ||
        (coleccion === 'auth' && partes[2] === 'login' && metodo === 'POST');

    if (metodo !== 'GET' && !escrituraPermitida) {
        return sinPermisos();
    }

    if (coleccion === 'auth' && partes[2] === 'login' && metodo === 'POST') {
        return login(opciones);
    }

    if (coleccion === 'reservas' && metodo === 'POST') {
        return crearReserva(opciones);
    }

    const id = Number(partes[2]);

    switch (coleccion) {
        case 'cities':
            return respuesta(200, ciudades);

        case 'cinemas': {
            const city = url.searchParams.get('city');
            return respuesta(200, city ? cines.filter(cine => cine.cityId === city) : cines);
        }

        case 'salas': {
            const cinemaId = url.searchParams.get('cinemaId');
            return respuesta(200, cinemaId ? salas.filter(sala => String(sala.cinemaId) === cinemaId) : salas);
        }

        case 'peliculas': {
            if (partes[2]) {
                const pelicula = peliculas.find(item => item.id === id);
                return pelicula ? respuesta(200, pelicula) : noEncontrado('Película no encontrada');
            }
            return respuesta(200, peliculas);
        }

        case 'funciones': {
            if (partes[2]) {
                const funcion = funciones.find(item => item.id === id);
                return funcion ? respuesta(200, funcion) : noEncontrado('Función no encontrada');
            }

            const peliculaId = url.searchParams.get('peliculaId');
            const fecha = url.searchParams.get('fecha');
            let resultado = funciones;

            if (peliculaId) {
                resultado = resultado.filter(funcion => String(funcion.movie.id) === peliculaId);
            }
            if (fecha) {
                resultado = resultado.filter(funcion => funcion.date === fecha);
            }

            return respuesta(200, resultado);
        }

        case 'snacks':
            return respuesta(200, snacks);

        case 'beneficios':
            return respuesta(200, beneficios);

        case 'promociones':
            return respuesta(200, promociones);

        case 'tipos-entradas':
            return respuesta(200, filtrarTiposEntrada(url.searchParams.get('tipoSala')));

        case 'formatos':
            return respuesta(200, formatos);

        case 'generos':
            return respuesta(200, generos);

        case 'reservas': {
            const funcionId = url.searchParams.get('funcionId');
            const todas = [...reservas, ...leerReservasVisitante()];
            const resultado = funcionId
                ? todas.filter(reserva => String(reserva.funcion?.id) === funcionId)
                : todas;
            return respuesta(200, resultado);
        }

        case 'usuarios': {
            if (partes[2]) {
                return String(usuarioInvitado.id) === String(partes[2])
                    ? respuesta(200, usuarioInvitado)
                    : noEncontrado('Usuario no encontrado');
            }
            return respuesta(200, [usuarioInvitado]);
        }

        default:
            return respuesta(200, []);
    }
};

export { API_ENDPOINTS };
