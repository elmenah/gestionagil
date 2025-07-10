import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface Visita {
  id: number;
  cliente: string;
  fecha: string;
  ubicacion: string;
  hora: string;
  equipo: string;
}

export default function HU03_CalendarioVisitas() {
  const [visitas] = useState<Visita[]>([
    {
      id: 1,
      cliente: "Clínica San Pedro",
      fecha: "2025-07-10",
      ubicacion: "Av. Las Flores 123",
      hora: "10:00 AM",
      equipo: "Monitor cardíaco",
    },
    {
      id: 2,
      cliente: "Hospital Central",
      fecha: "2025-07-11",
      ubicacion: "Calle Salud 456",
      hora: "2:00 PM",
      equipo: "Bomba de infusión",
    },
    {
      id: 3,
      cliente: "Centro Médico Vida",
      fecha: "2025-06-15",
      ubicacion: "Camino Médico 789",
      hora: "9:00 AM",
      equipo: "Ventilador mecánico",
    },
  ]);

  const [visitaSeleccionada, setVisitaSeleccionada] = useState<Visita | null>(null);

  const eventos = visitas.map((v) => ({
    title: `Visita técnica - ${v.cliente}`,
    date: v.fecha,
    id: String(v.id),
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    const visita = visitas.find((v) => v.id === parseInt(clickInfo.event.id));
    if (visita) {
      setVisitaSeleccionada(visita);
    }
  };

  const agregarAGoogleCalendar = (visita: Visita) => {
    // Parsear fecha y hora a formato Date
    const [year, month, day] = visita.fecha.split("-").map(Number);
    let [hora, minutos] = visita.hora.replace("AM", "").replace("PM", "").trim().split(":").map(Number);
    if (visita.hora.toLowerCase().includes("pm") && hora < 12) hora += 12;
    // Formato local sin Z para Google Calendar
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatLocal = (d: Date) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const startDate = new Date(year, month - 1, day, hora, minutos, 0);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Visita%20Técnica%20-%20${encodeURIComponent(visita.cliente)}&details=${encodeURIComponent('Equipo: ' + visita.equipo + '\nUbicación: ' + visita.ubicacion)}&dates=${formatLocal(startDate)}/${formatLocal(endDate)}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-3xl font-bold">Mi Calendario de Visitas Técnicas</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        events={eventos}
        eventColor="#4CAF50"
        height="auto"
        eventClick={handleEventClick}
      />

      {/* Modal de Detalle */}
      {visitaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Detalle de Visita</h2>
            <p><strong>Cliente:</strong> {visitaSeleccionada.cliente}</p>
            <p><strong>Ubicación:</strong> {visitaSeleccionada.ubicacion}</p>
            <p><strong>Fecha:</strong> {visitaSeleccionada.fecha}</p>
            <p><strong>Hora:</strong> {visitaSeleccionada.hora}</p>
            <p><strong>Equipo:</strong> {visitaSeleccionada.equipo}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => agregarAGoogleCalendar(visitaSeleccionada)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Agregar a Google Calendar
              </button>
              <button
                onClick={() => setVisitaSeleccionada(null)}
                className="text-gray-600 hover:text-gray-800 text-xl border px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
