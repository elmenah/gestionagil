import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  contrato: string;
}

interface Ticket {
  id: number;
  producto: string;
  mensaje: string;
  tecnico: string;
  tiempoRespuesta: string;
  fecha: string;
  estado: string;
  fechaVisita: string; // Nueva propiedad
}

export default function HU05_Soporte() {
  const [productos] = useState<Producto[]>([
    { id: 1, nombre: "Monitor multiparamétrico", contrato: "CT-00123" },
    { id: 2, nombre: "Bomba de infusión", contrato: "CT-00110" },
    { id: 3, nombre: "Ventilador mecánico", contrato: "CT-00123" },
  ]);

  const [tecnicos] = useState(["Carlos Rojas", "Laura Soto", "Mario Díaz"]);

  const [productoSeleccionado, setProductoSeleccionado] = useState<number | "">("");
  const [descripcion, setDescripcion] = useState("");

  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Simulación de 4 solicitudes previas
    const datosIniciales: Ticket[] = [
      {
        id: 1,
        producto: "Monitor multiparamétrico",
        mensaje: "Pantalla parpadea ocasionalmente.",
        tecnico: "Carlos Rojas",
        tiempoRespuesta: "24 horas",
        fecha: "2025-07-07",
        estado: "Resuelto",
        fechaVisita: "2025-07-08 10:00",
      },
      {
        id: 2,
        producto: "Bomba de infusión",
        mensaje: "Error de calibración.",
        tecnico: "Laura Soto",
        tiempoRespuesta: "48 horas",
        fecha: "2025-07-05",
        estado: "En proceso",
        fechaVisita: "2025-07-07 10:00",
      },
      {
        id: 3,
        producto: "Ventilador mecánico",
        mensaje: "No enciende tras apagado.",
        tecnico: "Mario Díaz",
        tiempoRespuesta: "24 horas",
        fecha: "2025-07-03",
        estado: "Pendiente",
        fechaVisita: "2025-07-04 10:00",
      },
      {
        id: 4,
        producto: "Monitor multiparamétrico",
        mensaje: "Alarma suena sin motivo.",
        tecnico: "Carlos Rojas",
        tiempoRespuesta: "48 horas",
        fecha: "2025-07-01",
        estado: "Resuelto",
        fechaVisita: "2025-07-03 10:00",
      },
    ];
    setTickets(datosIniciales);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoSeleccionado || descripcion.trim() === "") return;

    const producto = productos.find((p) => p.id === productoSeleccionado);
    const tecnicoAsignado = tecnicos[Math.floor(Math.random() * tecnicos.length)];
    const tiempoRespuesta = Math.random() > 0.5 ? "24 horas" : "48 horas";

    const correo = 'hospisan@gmail.com';

    // Generar fecha de visita automática (mañana a las 10:00)
    const now = new Date();
    const fechaVisitaDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0, 0);
    const fechaVisita = fechaVisitaDate.toISOString().slice(0, 16).replace('T', ' ');

    const nuevoTicket: Ticket = {
      id: tickets.length + 1,
      producto: producto?.nombre ?? "Desconocido",
      mensaje: descripcion,
      tecnico: tecnicoAsignado,
      tiempoRespuesta,
      fecha: new Date().toISOString().split("T")[0],
      estado: "Pendiente",
      fechaVisita,
    };

    setTickets([nuevoTicket, ...tickets]);
    setProductoSeleccionado("");
    setDescripcion("");

    // Google Calendar quick add link con fecha de visita
    const startDate = fechaVisitaDate;
    const endDate = new Date(fechaVisitaDate.getTime() + 60 * 60 * 1000); // 1 hora
    const formatDate = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + 'Z';
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Visita%20Técnica%20-%20${encodeURIComponent(nuevoTicket.producto)}&details=${encodeURIComponent(nuevoTicket.mensaje + '\nTécnico: ' + tecnicoAsignado)}&dates=${formatDate(startDate)}/${formatDate(endDate)}`;

    if (window.confirm(`✅ Solicitud enviada.\nN° Ticket: ${nuevoTicket.id}\nSe ha enviado el ticket a tu correo: ${correo}\nTécnico asignado: ${tecnicoAsignado}\nTiempo estimado: ${tiempoRespuesta}\n\nVisita programada para: ${fechaVisita}\n\n¿Deseas agregar esta visita a tu Google Calendar?`)) {
      window.open(calendarUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Solicitud de Soporte Técnico</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded shadow p-6">
        <div>
          <label className="block mb-1 font-medium">Producto arrendado</label>
          <select
            value={productoSeleccionado}
            onChange={(e) => setProductoSeleccionado(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Seleccionar producto --</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} (Contrato: {p.contrato})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción del problema</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enviar solicitud
        </button>
      </form>

      {/* Historial de tickets (siempre visible) */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Historial de Solicitudes</h2>
        {tickets.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Ticket</th>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Descripción</th>
                <th className="border px-4 py-2">Técnico</th>
                <th className="border px-4 py-2">Tiempo Estimado</th>
                <th className="border px-4 py-2">Estado</th>
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Fecha Visita</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td className="border px-4 py-2">#{t.id}</td>
                  <td className="border px-4 py-2">{t.producto}</td>
                  <td className="border px-4 py-2">{t.mensaje}</td>
                  <td className="border px-4 py-2">{t.tecnico}</td>
                  <td className="border px-4 py-2">{t.tiempoRespuesta}</td>
                  <td className="border px-4 py-2">{t.estado}</td>
                  <td className="border px-4 py-2">{t.fecha}</td>
                  <td className="border px-4 py-2">{t.fechaVisita}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">Aún no has enviado solicitudes de soporte.</p>
        )}
      </div>
    </div>
  );
}
