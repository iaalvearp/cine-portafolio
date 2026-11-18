export interface User {
    id?: number;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'USER';
    telefono?: string;
}
