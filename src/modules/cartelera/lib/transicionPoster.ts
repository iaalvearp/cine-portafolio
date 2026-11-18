const CLAVE = 'cine_origen_poster';

// Paridad exacta con la animación de apertura de MovieDetail.
const DURACION = 700;
const AMORTIGUACION = 'cubic-bezier(0.22, 1, 0.36, 1)';

type Origen = { id: string; left: number; top: number; width: number; height: number };

let enMemoria: Origen | null = null;

export function guardarOrigen(id: string | number, el: Element): void {
  // Si quedó un regreso en curso, se termina aquí: no debe sobrevivir a una apertura.
  limpiarRegreso();

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

/* ------------------------------------------------------------------ */
/* Regreso: póster grande del detalle → miniatura de su MovieCard      */
/* ------------------------------------------------------------------ */

export type Rect = { left: number; top: number; width: number; height: number };

type Regreso = {
  id: string;
  /** Clon desprendido del marco grande: ya no depende del componente desmontado. */
  clon: HTMLElement;
  /** Miniatura real de la MovieCard, localizada después de montar la cartelera. */
  destino: HTMLElement;
  opacidadPrevia: string;
  origen: Rect;
  anim: Animation | null;
  /** Último recurso si el evento `finish` nunca llega (pestaña en segundo plano). */
  respaldo: number | null;
};

let regreso: Regreso | null = null;

const movimientoReducido = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Localiza la miniatura de la MovieCard de una película concreta.
 * Se identifica por el `view-transition-name` único que ya lleva su imagen.
 */
function buscarMiniatura(id: string): HTMLElement | null {
  const esperado = `movie-poster-${id}`;
  const candidatos = document.querySelectorAll('[data-poster-img]');
  for (let i = 0; i < candidatos.length; i++) {
    const img = candidatos[i] as HTMLElement;
    if (img.style.getPropertyValue('view-transition-name') === esperado) return img;
  }
  return null;
}

function limpiarRegreso(): void {
  const r = regreso;
  if (!r) return;
  regreso = null;
  if (r.respaldo !== null) {
    window.clearTimeout(r.respaldo);
    r.respaldo = null;
  }
  try {
    r.anim?.cancel();
  } catch {
    /* la animación ya no existe */
  }
  // Restaura la miniatura aunque el componente esté desmontado (nodo suelto = inocuo).
  r.destino.style.opacity = r.opacidadPrevia;
  r.clon.remove();
}

/**
 * Se ejecuta dentro de la transición, después de que la cartelera ya está montada:
 * oculta la miniatura destino y coloca un clon del póster grande en su posición.
 * Devuelve false si no hay dónde animar (no se toca nada).
 */
export function prepararRegreso(id: string | number, grande: Element | null, origen: Rect): boolean {
  limpiarRegreso();

  const idPelicula = String(id);
  if (!grande || movimientoReducido()) return false;
  if (!(origen.width > 0 && origen.height > 0)) return false;

  const destino = buscarMiniatura(idPelicula);
  if (!destino) return false;

  const clon = grande.cloneNode(true) as HTMLElement;
  if (!clon || typeof clon.animate !== 'function') return false;

  clon.removeAttribute('id');
  clon.style.position = 'fixed';
  clon.style.left = `${origen.left}px`;
  clon.style.top = `${origen.top}px`;
  clon.style.width = `${origen.width}px`;
  clon.style.height = `${origen.height}px`;
  clon.style.margin = '0';
  clon.style.zIndex = '100';
  clon.style.pointerEvents = 'none';
  document.body.appendChild(clon);

  const opacidadPrevia = destino.style.opacity;
  destino.style.opacity = '0';

  const pendiente: Regreso = {
    id: idPelicula,
    clon,
    destino,
    opacidadPrevia,
    origen,
    anim: null,
    // Cubre el fundido previo + la animación; solo es un salvavidas.
    respaldo: window.setTimeout(() => {
      if (regreso === pendiente) limpiarRegreso();
    }, DURACION * 2 + 500),
  };
  regreso = pendiente;
  return true;
}

/**
 * Reproduce el viaje inverso. Se llama cuando la transición termina (o se salta),
 * con la cartelera ya visible y las coordenadas medidas en ese momento.
 */
export function reproducirRegreso(): void {
  const r = regreso;
  if (!r) return;

  const rect = r.destino.getBoundingClientRect();
  const visible =
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth;

  // Sin destino utilizable: se retira todo y la miniatura vuelve a verse sola.
  if (!r.clon.isConnected || !visible) {
    limpiarRegreso();
    return;
  }

  const dx = rect.left - r.origen.left;
  const dy = rect.top - r.origen.top;
  const sx = rect.width / r.origen.width;
  const sy = rect.height / r.origen.height;

  let anim: Animation;
  try {
    anim = r.clon.animate(
      [
        { transformOrigin: 'top left', transform: 'translate(0px, 0px) scale(1, 1)' },
        { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
      ],
      { duration: DURACION, easing: AMORTIGUACION, fill: 'both' }
    );
  } catch {
    limpiarRegreso();
    return;
  }

  r.anim = anim;

  // Plazo exacto de la animación: si `finish` no llega, se retira igual.
  if (r.respaldo !== null) window.clearTimeout(r.respaldo);
  r.respaldo = window.setTimeout(() => {
    if (regreso === r) limpiarRegreso();
  }, DURACION + 400);

  const terminar = () => {
    // Solo limpia si este sigue siendo el regreso vigente (evita fantasmas).
    if (regreso === r) limpiarRegreso();
  };
  anim.onfinish = terminar;
  anim.oncancel = terminar;
}
