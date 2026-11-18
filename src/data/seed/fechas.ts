/** Devuelve una fecha ISO (yyyy-MM-dd) relativa a hoy, usando la hora local. */
export const fechaRelativa = (dias: number): string => {
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    fecha.setDate(fecha.getDate() + dias);
    const pad = (valor: number) => String(valor).padStart(2, '0');
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
};
