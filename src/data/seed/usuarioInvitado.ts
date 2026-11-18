export interface UsuarioInvitado {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    telefono?: string;
}

export const usuarioInvitado: UsuarioInvitado = {
    id: 1,
    nombre: 'Invitado',
    email: 'invitado@demo.com',
    rol: 'USER',
    telefono: '+593 99 000 0000',
};

export const credencialesDemo = {
    email: 'invitado@demo.com',
    password: 'demo1234',
};
