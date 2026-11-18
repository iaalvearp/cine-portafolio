import { useState } from 'react';
import type { Movie } from '@/modules/cartelera/types/Movie';
import { cn } from '@/lib/utils';

// La entrada animada solo se reproduce la primera vez que aparece cada película.
const heroesYaAnimados = new Set<string>();

interface HeroMediaProps {
  movie: Movie;
}

/**
 * Capas del bloque superior: portada desenfocada de respaldo, imagen grande,
 * degradado inferior, degradado lateral y viñeta. Todas comparten el mismo
 * contenedor relative/overflow-hidden con position:absolute; inset:0.
 */
export function HeroMedia({ movie }: HeroMediaProps) {
  const sinBannerPropio = movie.fondo === movie.poster;
  const [cargada, setCargada] = useState(() => heroesYaAnimados.has(movie.id));

  const marcarCargada = () => {
    heroesYaAnimados.add(movie.id);
    setCargada(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Respaldo: portada ampliada y desenfocada, también usada como fondo ambiental. */}
      <img
        src={movie.poster}
        alt=""
        aria-hidden="true"
        className={cn(
          'absolute inset-0 w-full h-full object-cover scale-110',
          sinBannerPropio ? 'blur-[30px] brightness-[0.55]' : 'blur-[24px]'
        )}
      />

      {/* Imagen grande: crossfade desde la portada al terminar de cargar. */}
      {!sinBannerPropio && (
        <img
          src={movie.fondo}
          alt={movie.title}
          fetchPriority="high"
          decoding="async"
          onLoad={marcarCargada}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out',
            cargada ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.06]'
          )}
          style={{ objectPosition: 'center 25%' }}
        />
      )}

      {/* Degradado inferior que termina en el color de fondo de la página. */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background" />

      {/* Degradado lateral izquierdo para legibilidad. */}
      <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/35 to-transparent" />

      {/* Viñeta ligera en los bordes. */}
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 140px 40px rgba(0,0,0,0.4)' }} />
    </div>
  );
}
