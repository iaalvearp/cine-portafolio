import { flushSync } from 'react-dom';

/** Nombre compartido por la miniatura y la portada grande de una misma película. */
export const nombrePoster = (id: string | number): string => `movie-poster-${id}`;

const movimientoReducido = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Envuelve un cambio de estado React en una transición nativa del navegador.
 * Como la tarjeta y el detalle usan el mismo `view-transition-name`, el navegador
 * captura ambos estados e interpola posición y tamaño automáticamente en los
 * dos sentidos, sin calcular recorridos ni crear animaciones manuales.
 */
export function conTransicion(actualizar: () => void): void {
  if (
    typeof document === 'undefined' ||
    typeof document.startViewTransition !== 'function' ||
    movimientoReducido()
  ) {
    actualizar();
    return;
  }

  const transicion = document.startViewTransition(() => {
    flushSync(actualizar);
  });

  // Una transición puede ser interrumpida por otra; el DOM ya está actualizado.
  void transicion.ready.catch(() => {});
  void transicion.finished.catch(() => {});
}
