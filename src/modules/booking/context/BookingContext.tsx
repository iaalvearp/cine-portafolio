import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { Movie, Showtime, TicketType } from '@/data/mockData';
import type { Promocion } from '@/modules/marketing/services/promocionesService';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/config/api';
import { apiFetch } from '@/lib/localApi';

export interface Snack {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface SelectedSnack extends Snack {
  quantity: number;
}

export interface SelectedTicket {
  type: TicketType;
  quantity: number;
}

export interface SelectedSeat {
  id: string;
  row: string;
  number: number;
  type?: 'normal' | 'vip';
  price: number;
}

interface ReservaGuardada {
  id: number;
  seats: string[];
  total: number;
  bookingDate: string;
  [key: string]: any;
}

const CLAVE_RESERVA_ACTUAL = 'cine_reserva_actual';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface BookingState {
  selectedMovie: Movie | null;
  selectedDate: Date;
  selectedShowtime: Showtime | null;
  selectedSeats: SelectedSeat[];
  selectedTickets: SelectedTicket[];
  selectedSnacks: SelectedSnack[];
  step: 'cartelera' | 'movie' | 'seats' | 'tickets' | 'snacks' | 'payment' | 'receipt' | 'dulceria' | 'beneficios' | 'promociones' | 'perfil' | 'login' | 'register';
  city: string;
  cinema: string;
  user: User | null;
  selectedPromotion: Promocion | null;
  ultimaReserva: ReservaGuardada | null;
}

interface BookingContextType extends BookingState {
  setSelectedMovie: (movie: Movie | null) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  setSelectedPromotion: (promotion: Promocion | null) => void;
  addSeat: (seat: SelectedSeat) => void;
  removeSeat: (seatId: string) => void;
  setSelectedTickets: (tickets: SelectedTicket[]) => void;
  updateTicketQuantity: (typeId: string, quantity: number) => void;
  addSnack: (snack: Snack) => void;
  removeSnack: (snackId: string) => void;
  updateSnackQuantity: (snackId: string, quantity: number) => void;
  setStep: (step: BookingState['step']) => void;
  setCity: (city: string) => void;
  setCinema: (cinema: string) => void;
  getTotal: () => number;
  getTotalTickets: () => number;
  resetBooking: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  confirmBooking: () => Promise<boolean>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children, initialStep = 'cartelera' }: { children: ReactNode; initialStep?: BookingState['step'] }) {
  const [state, setState] = useState<BookingState>({
    selectedMovie: null,
    selectedDate: new Date(),
    selectedShowtime: null,
    selectedSeats: [],
    selectedTickets: [],
    selectedSnacks: [],
    step: initialStep,
    city: 'quito',
    cinema: 'scala',
    user: null,
    selectedPromotion: null,
    ultimaReserva: null,
  });

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cine_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState(prev => ({ ...prev, user }));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('cine_user');
      }
    }
  }, []);

  // Restore the booking in progress after a full page navigation/reload.
  // The current step always comes from the Astro page, so menu navigation keeps working.
  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(CLAVE_RESERVA_ACTUAL);
      if (!guardado) return;

      const datos = JSON.parse(guardado);
      setState(prev => ({
        ...prev,
        selectedMovie: datos.selectedMovie ?? prev.selectedMovie,
        selectedDate: datos.selectedDate ? new Date(datos.selectedDate) : prev.selectedDate,
        selectedShowtime: datos.selectedShowtime ?? prev.selectedShowtime,
        selectedSeats: Array.isArray(datos.selectedSeats) ? datos.selectedSeats : prev.selectedSeats,
        selectedTickets: Array.isArray(datos.selectedTickets) ? datos.selectedTickets : prev.selectedTickets,
        selectedSnacks: Array.isArray(datos.selectedSnacks) ? datos.selectedSnacks : prev.selectedSnacks,
        selectedPromotion: datos.selectedPromotion ?? prev.selectedPromotion,
        city: datos.city ?? prev.city,
        cinema: datos.cinema ?? prev.cinema,
        ultimaReserva: datos.ultimaReserva ?? prev.ultimaReserva,
      }));
    } catch (e) {
      console.error("Failed to restore booking", e);
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE_RESERVA_ACTUAL, JSON.stringify({
        selectedMovie: state.selectedMovie,
        selectedDate: state.selectedDate instanceof Date ? state.selectedDate.toISOString() : new Date().toISOString(),
        selectedShowtime: state.selectedShowtime,
        selectedSeats: state.selectedSeats,
        selectedTickets: state.selectedTickets,
        selectedSnacks: state.selectedSnacks,
        selectedPromotion: state.selectedPromotion,
        city: state.city,
        cinema: state.cinema,
        ultimaReserva: state.ultimaReserva,
      }));
    } catch {
      // La demo sigue funcionando aunque el navegador bloquee sessionStorage.
    }
  }, [state]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiFetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const user = { id: data.id, nombre: data.nombre, email: email, rol: data.rol };
        localStorage.setItem('cine_user', JSON.stringify(user));
        setState(prev => ({
          ...prev,
          user,
          step: 'cartelera'
        }));
        toast.success(`Bienvenido, ${data.nombre}`);
      } else {
        throw new Error(data.mensaje || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('cine_user');
    setState(prev => ({ ...prev, user: null, step: 'cartelera' }));
    toast.info("Has cerrado sesión");
    window.location.href = '/';
  };

  const confirmBooking = async (): Promise<boolean> => {
    try {
      if (!state.selectedShowtime) {
        toast.error("Información de función faltante");
        return false;
      }

      // Generate payload for Java backend
      // Fallback to ID 1 (Consumidor Final or System Default) if no user logged in
      const payload = {
        usuario: { id: state.user?.id || 1 },
        funcion: { id: state.selectedShowtime.id },
        seats: state.selectedSeats.map(s => `${s.row}${s.number}`),
        total: getTotal()
      };

      const response = await apiFetch(API_ENDPOINTS.RESERVAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || 'Error al procesar la reserva');
      }

      const reserva = await response.json().catch(() => null) as ReservaGuardada | null;
      setState(prev => ({ ...prev, ultimaReserva: reserva }));
      return true;
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(error instanceof Error ? error.message : "No se pudo completar la reserva");
      return false;
    }
  };

  const setSelectedPromotion = (promotion: Promocion | null) => {
    setState(prev => ({ ...prev, selectedPromotion: promotion }));
  };

  const setSelectedMovie = (movie: Movie | null) => {
    setState(prev => ({ ...prev, selectedMovie: movie, step: movie ? 'movie' : 'cartelera' }));
  };

  const setSelectedDate = (date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  const setSelectedShowtime = (showtime: Showtime | null) => {
    setState(prev => ({ ...prev, selectedShowtime: showtime }));
  };

  const addSeat = (seat: SelectedSeat) => {
    setState(prev => {
      // Prevent duplicates
      if (prev.selectedSeats.some(s => s.id === seat.id)) return prev;
      return {
        ...prev,
        selectedSeats: [...prev.selectedSeats, seat],
      };
    });
  };

  const removeSeat = (seatId: string) => {
    setState(prev => ({
      ...prev,
      selectedSeats: prev.selectedSeats.filter(s => s.id !== seatId),
    }));
  };

  const setSelectedTickets = (tickets: SelectedTicket[]) => {
    setState(prev => ({ ...prev, selectedTickets: tickets }));
  };

  const updateTicketQuantity = (typeId: string, quantity: number) => {
    setState(prev => {
      const existing = prev.selectedTickets.find(t => t.type.id === typeId);
      if (existing) {
        if (quantity <= 0) {
          return {
            ...prev,
            selectedTickets: prev.selectedTickets.filter(t => t.type.id !== typeId),
          };
        }
        return {
          ...prev,
          selectedTickets: prev.selectedTickets.map(t =>
            t.type.id === typeId ? { ...t, quantity } : t
          ),
        };
      }
      return prev;
    });
  };

  const addSnack = (snack: Snack) => {
    setState(prev => {
      const existing = prev.selectedSnacks.find(s => s.id === snack.id);
      if (existing) {
        return {
          ...prev,
          selectedSnacks: prev.selectedSnacks.map(s =>
            s.id === snack.id ? { ...s, quantity: s.quantity + 1 } : s
          )
        };
      }
      return {
        ...prev,
        selectedSnacks: [...prev.selectedSnacks, { ...snack, quantity: 1 }]
      };
    });
    toast.success("Snack agregado", { position: 'bottom-center' });
  };

  const removeSnack = (snackId: string) => {
    setState(prev => ({
      ...prev,
      selectedSnacks: prev.selectedSnacks.filter(s => s.id !== snackId)
    }));
  };

  const updateSnackQuantity = (snackId: string, quantity: number) => {
    setState(prev => {
      if (quantity <= 0) {
        return {
          ...prev,
          selectedSnacks: prev.selectedSnacks.filter(s => s.id !== snackId)
        };
      }
      return {
        ...prev,
        selectedSnacks: prev.selectedSnacks.map(s =>
          s.id === snackId ? { ...s, quantity } : s
        )
      };
    });
  };

  const setStep = (step: BookingState['step']) => {
    setState(prev => ({ ...prev, step }));
  };

  const setCity = (city: string) => {
    setState(prev => ({ ...prev, city }));
  };

  const setCinema = (cinema: string) => {
    setState(prev => ({ ...prev, cinema }));
  };

  const getTotal = () => {
    const ticketsTotal = state.selectedSeats.reduce((sum, seat) => sum + seat.price, 0); // Price comes from seat now for accuracy? Or tickets?
    // User requested "Calcula automáticamente los boletos basándote en los asientos seleccionados".
    // Usually tickets have 'types' like Adult, Child. But the prompt says "asumiendo tarifa general por defecto".
    // So if selectedTickets is populated based on seats, we can use that.
    // However, if we populate selectedTickets with { type: 'General', price: X }, we can use that.
    // Let's stick to using selectedTickets for the total if populated, OR fallback to seats sum if simplified.
    // Given the prompt: "Calcula automáticamente los boletos... (ej: Si es sala 2D, asigna N entradas 'General 2D')".
    // So selectedTickets WILL be populated.
    const ticketsTotalFromTickets = state.selectedTickets.reduce((sum, t) => sum + t.type.price * t.quantity, 0);
    const snacksTotal = state.selectedSnacks.reduce((sum, s) => sum + s.price * s.quantity, 0);
    const subtotal = ticketsTotalFromTickets + snacksTotal;

    if (!state.selectedPromotion) return subtotal;

    const descuento = state.selectedPromotion.descuento ?? '';
    const coincidencia = descuento.match(/(\d+)%/);
    const porcentaje = coincidencia ? Number(coincidencia[1]) : 10;
    return Number((subtotal * (1 - porcentaje / 100)).toFixed(2));
  };

  const getTotalTickets = () => {
    return state.selectedTickets.reduce((sum, t) => sum + t.quantity, 0);
  };

  const resetBooking = () => {
    try {
      sessionStorage.removeItem(CLAVE_RESERVA_ACTUAL);
    } catch {
      // Nada que limpiar si el almacenamiento no está disponible.
    }
    setState({
      selectedMovie: null,
      selectedDate: new Date(),
      selectedShowtime: null,
      selectedSeats: [],
      selectedTickets: [],
      selectedSnacks: [],
      step: 'cartelera',
      city: state.city,
      cinema: state.cinema,
      user: state.user,
      selectedPromotion: null,
      ultimaReserva: null,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setSelectedMovie,
        setSelectedDate,
        setSelectedShowtime,
        setSelectedPromotion,
        addSeat,
        removeSeat,
        setSelectedTickets,
        updateTicketQuantity,
        addSnack,
        removeSnack,
        updateSnackQuantity,
        setStep,
        setCity,
        setCinema,
        getTotal,
        getTotalTickets,
        resetBooking,
        login,
        logout,
        confirmBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}