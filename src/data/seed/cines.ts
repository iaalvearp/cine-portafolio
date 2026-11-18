export interface Cinema {
    id: number;
    name: string;
    address: string;
    cityId: string;
}

export const cines: Cinema[] = [
    { id: 1, name: 'Multicines CCI', address: 'Av. Amazonas y Naciones Unidas', cityId: 'quito' },
    { id: 2, name: 'Multicines Scala', address: 'Pasaje el Valle, Cumbayá', cityId: 'quito' },
    { id: 3, name: 'Supercines Ceibos', address: 'Av. Del Bombero Km 6.5', cityId: 'guayaquil' },
    { id: 4, name: 'Multicines Mall del Sol', address: 'Av. Joaquín Orrantia y Juan Tanca Marengo', cityId: 'guayaquil' },
    { id: 5, name: 'Supercines Manta', address: 'Av. 4 de Noviembre, Paseo Shopping', cityId: 'manta' },
    { id: 6, name: 'Multicines Mall del Pacífico', address: 'Av. Circunvalación y Calle 23', cityId: 'manta' },
];
