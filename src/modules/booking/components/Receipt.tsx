import { useRef } from 'react';
import { Download, Share2, Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useBooking } from '@/modules/booking/context/BookingContext';
import { cinemas } from '@/data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// @ts-ignore
import QRCode from 'react-qr-code'; // Assuming usage of a QR lib or keeping current SVG if simple

export function Receipt() {
  const {
    selectedMovie,
    selectedShowtime,
    selectedDate,
    selectedSeats,
    cinema,
    getTotal,
    resetBooking,
    ultimaReserva,
  } = useBooking();

  const receiptRef = useRef<HTMLDivElement>(null);

  // Tras confirmar, el estado transitorio se limpia y el ticket se renderiza
  // desde la instantánea guardada en la reserva confirmada.
  const snapshot = ultimaReserva?.receipt as {
    movie?: typeof selectedMovie;
    showtime?: typeof selectedShowtime;
    date?: string;
    cinema?: string;
    seats?: typeof selectedSeats;
  } | undefined;

  const movie = snapshot?.movie ?? selectedMovie;
  const showtime = snapshot?.showtime ?? selectedShowtime;
  const fechaTicket = snapshot?.date ? new Date(snapshot.date) : selectedDate;
  const seats = snapshot?.seats ?? selectedSeats;
  const cinemaId = snapshot?.cinema ?? cinema;

  if (!movie || !showtime) return null;

  const cinemaInfo = cinemas.find(c => c.id === cinemaId);
  const total = ultimaReserva?.total ?? getTotal();
  const orderNumber = `RES-${String(ultimaReserva?.id ?? Date.now()).slice(-8)}`;

  const handleDownloadPDF = async () => {
    // Target the specific hidden element designed for PDF generation
    // This avoids all issues with responsiveness, dark mode variables (oklab), and complex CSS
    const element = document.getElementById('receipt-hidden-print');
    if (!element) return;

    try {
      // html2canvas no espera a las imágenes: las decodificamos antes para que
      // el PDF use exactamente lo que se ve en pantalla.
      const imagenes = Array.from(element.querySelectorAll('img'));
      await Promise.all(imagenes.map(async (img) => {
        if (!img.complete) {
          await new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
          });
        }
        try {
          await img.decode();
        } catch {
          // Si el navegador no puede decodificarla, se captura tal cual.
        }
      }));

      // Use a slightly larger scale for crisp text
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#000000', // Force black background
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ToTalk-Ticket-${orderNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-background flex flex-col">
      <div className="container mx-auto h-full px-4">
        <div className="h-full grid lg:grid-cols-2 gap-8 items-center">

          {/* LEFT COLUMN (Desktop): Message & Actions */}
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in order-2 lg:order-1 lg:items-start lg:text-left">
            <div className="relative mb-4 lg:mb-0">
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                ¡Compra Exitosa!
              </h1>
              <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
                Tu reserva de demostración quedó guardada en este navegador. Descarga tu ticket PDF.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Button
                variant="outline"
                className="flex-1 h-12 font-bold text-lg"
                onClick={handleDownloadPDF}
              >
                <Download className="w-5 h-5 mr-2" />
                Ticket PDF
              </Button>
              <Button
                className="flex-1 bg-[#F5B041] hover:bg-[#E59830] text-black h-12 font-bold text-lg border-0 transition-colors"
                onClick={resetBooking}
              >
                <Home className="w-5 h-5 mr-2" />
                Inicio
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN (Desktop): Ticket Card */}
          <div className="flex justify-center animate-slide-up order-1 lg:order-2 h-full items-center">
            {/* TICKET WRAPPER FOR PDF GENERATION */}
            {/* Inline Styles forced for html2canvas compatibility with updated CSS/Vars */}
            <div
              id="receipt-card"
              className="relative isolate w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
              style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
            >
              {/* Única capa de fondo: la imagen cubre toda la tarjeta y el
                  degradado va encima. Ningún elemento en flujo desplaza estas
                  capas; todo el contenido se apila después. */}
              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                <img
                  src={movie.poster}
                  alt=""
                  crossOrigin="anonymous"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ opacity: 0.55 }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 100%)' }}
                />
              </div>

              {/* Content Container */}
              <div className="relative z-10">
                <div className="px-6 pt-8 pb-2">
                  <h2 className="text-2xl font-bold leading-none drop-shadow-md" style={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{movie.title}</h2>
                  <p className="text-sm font-bold tracking-wide mt-1" style={{ color: '#F5B041' }}>{showtime.format}</p>
                </div>

                <div className="p-6 pt-2">
                  {/* Validation Info */}
                  <div className="flex justify-center mb-6 relative">
                    <div className="bg-white p-2 rounded-xl">
                      {/* Placeholder QR for visual */}
                      <svg viewBox="0 0 100 100" className="w-24 h-24 text-black">
                        <path fill="#000000" d="M10 10h30v30H10zm50 0h30v30H60zm0 50h30v30H60zM10 60h30v30H10z" />
                        <path fill="#000000" d="M45 15h10v10H45zm-5 10h5v5h-5zm10 5h5v5h-5zm-15 5h10v10h-10zm25 0h10v10h-10zm-35 5h5v5h-5zm55-5h10v10h-10z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-3 px-3 py-0.5 rounded-full border" style={{ backgroundColor: '#000000', borderColor: '#333333' }}>
                      <p className="text-[10px] font-mono tracking-widest" style={{ color: '#FFFFFF' }}>{orderNumber}</p>
                    </div>
                  </div>

                  {/* Details Grid - Strong Styling for PDF */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Cine</p>
                      <p className="font-bold text-base" style={{ color: '#FFFFFF' }}>{cinemaInfo?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Sala</p>
                      <p className="font-bold text-base" style={{ color: '#F5B041' }}>{showtime.room}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Fecha</p>
                      <p className="font-bold text-base" style={{ color: '#FFFFFF' }}>{format(fechaTicket, "d MMM yyyy", { locale: es })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#9CA3AF' }}>Hora</p>
                      <p className="font-bold text-base" style={{ color: '#FFFFFF' }}>{showtime.time}</p>
                    </div>
                  </div>

                  {/* Dashed Divider Canvas-Safe */}
                  <div className="w-full h-px mb-4" style={{ backgroundColor: '#333333', backgroundImage: 'linear-gradient(to right, #333 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x' }}></div>

                  {/* Seats */}
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Asientos</p>
                    <div className="flex flex-wrap gap-2">
                      {seats.map(s => (
                        <span key={s.id} className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#F5B041', color: '#000000' }}>
                          {s.row}{s.number}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-end pt-2 border-t" style={{ borderColor: '#333333' }}>
                    <span className="font-medium text-xs uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Total</span>
                    <span className="text-2xl font-black" style={{ color: '#FFFFFF' }}>${total.toFixed(2)}</span>
                  </div>

                  {/* Brand Footer */}
                  <div className="mt-6 text-center opacity-50">
                    <p className="font-bold tracking-[0.3em] text-[10px] uppercase" style={{ color: '#FFFFFF' }}>To Talk</p>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 
        HIDDEN PRINT TEMPLATE 
        This element is rendered off-screen specifically for html2canvas.
        It uses inline styles and HEX colors to avoid CSS variable parsing errors (oklab).
        It replicates the visual design but optimized for PDF generation.
      */}
      <div
        id="receipt-hidden-print"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '384px',
          backgroundColor: '#000000',
          color: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          fontFamily: 'sans-serif', // Ensure standard font for PDF
        }}
      >
        {/* Única capa de fondo, idéntica a la tarjeta visible: la imagen cubre
            toda la tarjeta y el degradado va encima, sin elementos en flujo. */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <img
            src={movie.poster}
            alt=""
            crossOrigin="anonymous"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.55 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 100%)' }}></div>
        </div>

        {/* Content Layer */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* Cabecera de texto: sin segunda imagen que desplace las capas. */}
          <div style={{ padding: '32px 24px 8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1', margin: 0, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {movie.title}
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px', color: '#F5B041', margin: 0 }}>
              {showtime.format}
            </p>
          </div>

          <div style={{ padding: '8px 24px 24px' }}>

            {/* QR Code Area */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '12px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '96px', height: '96px', display: 'block' }}>
                  <path fill="#000000" d="M10 10h30v30H10zm50 0h30v30H60zm0 50h30v30H60zM10 60h30v30H10z" />
                  <path fill="#000000" d="M45 15h10v10H45zm-5 10h5v5h-5zm10 5h5v5h-5zm-15 5h10v10h-10zm25 0h10v10h-10zm-35 5h5v5h-5zm55-5h10v10h-10z" />
                </svg>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                padding: '2px 12px',
                borderRadius: '9999px',
                backgroundColor: '#000000',
                border: '1px solid #333333',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#FFFFFF', margin: 0 }}>
                  {orderNumber}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
              <div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '2px' }}>Cine</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>{cinemaInfo?.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '2px' }}>Sala</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#F5B041', margin: 0 }}>{showtime.room}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '2px' }}>Fecha</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>{format(fechaTicket, "d MMM yyyy", { locale: es })}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '2px' }}>Hora</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>{showtime.time}</p>
              </div>
            </div>

            {/* Divider */}
            <div style={{
              width: '100%',
              height: '1px',
              marginBottom: '16px',
              backgroundColor: '#333333',
              // Simple solid line is safer for PDF than complex gradients
              borderBottom: '1px dashed #444444'
            }}></div>

            {/* Seats */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '8px' }}>Asientos</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {seats.map(s => (
                  <span key={s.id} style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    width: '32px', // Fixed width for better uniformity
                    height: '24px', // Fixed height
                    lineHeight: '24px', // Vertical centering via line-height
                    textAlign: 'center', // Horizontal centering
                    borderRadius: '4px',
                    backgroundColor: '#F5B041',
                    color: '#000000',
                    display: 'inline-block'
                  }}>
                    {s.row}{s.number}
                  </span>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'justify-between', alignItems: 'flex-end', paddingTop: '8px', borderTop: '1px solid #333333' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', flex: 1 }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#FFFFFF' }}>${total.toFixed(2)}</span>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '24px', textAlign: 'center', opacity: 0.5 }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
                To Talk
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
