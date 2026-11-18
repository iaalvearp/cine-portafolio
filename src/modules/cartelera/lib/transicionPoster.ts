const CLAVE = 'cine_origen_poster';

type Origen = { id: string; left: number; top: number; width: number; height: number };

let enMemoria: Origen | null = null;

export function guardarOrigen(id: string | number, el: Element): void {
  const r = el.getBoundingClientRect();
  const o: Origen = { id: String(id), left: r.left, top: r.top, width: r.width, height: r.height };
  enMemoria = o;
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(o));
  } catch {
    /* sin acceso a sessionStorage: se usa solo la memoria */
  }
}

export function tomarOrigen(id: string | number): Origen | null {
  let o = enMemoria;
  enMemoria = null;
  if (!o) {
    try {
      const raw = sessionStorage.getItem(CLAVE);
      if (raw) o = JSON.parse(raw) as Origen;
    } catch {
      o = null;
    }
  }
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    /* nada */
  }
  if (!o || String(o.id) !== String(id)) return null;
  if (!(o.width > 0 && o.height > 0)) return null;
  return o;
}
