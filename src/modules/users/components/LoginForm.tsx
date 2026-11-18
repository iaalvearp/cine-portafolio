import { useState } from 'react';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { toast } from 'sonner';
import { credencialesDemo } from '@/data/seed/usuarioInvitado';
import { MENSAJE_SIN_PERMISOS } from '@/lib/localApi';

export const LoginForm = () => {
    const { login, setStep } = useBooking();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const iniciarSesion = async (correo: string, clave: string) => {
        setIsLoading(true);
        try {
            await login(correo, clave);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await iniciarSesion(email, password);
    };

    const entrarComoInvitado = async () => {
        setEmail(credencialesDemo.email);
        setPassword(credencialesDemo.password);
        await iniciarSesion(credencialesDemo.email, credencialesDemo.password);
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Iniciar Sesión</CardTitle>
                    <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="rounded-lg border border-dashed border-[#F5B041]/40 bg-[#F5B041]/10 p-3 text-sm">
                            <p className="font-bold text-[#F5B041]">Acceso de invitado (demo)</p>
                            <p className="text-muted-foreground mt-1">Correo: {credencialesDemo.email}</p>
                            <p className="text-muted-foreground">Contraseña: {credencialesDemo.password}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full text-black font-bold hover:opacity-90 border-none"
                            style={{ background: 'linear-gradient(to right, hsl(var(--cinema-gold)), hsl(var(--cinema-gold-light)))' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Iniciando...' : 'Ingresar'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={entrarComoInvitado}
                            disabled={isLoading}
                        >
                            Entrar como invitado
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => toast.info(MENSAJE_SIN_PERMISOS)}
                        >
                            Crear cuenta
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setStep('cartelera')}
                        >
                            Volver a la cartelera
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
