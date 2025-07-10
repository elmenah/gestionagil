import { useState, useEffect } from "react";

interface Visita {
  id: number;
  servicio: string;
  tecnico: string;
  fecha: string;
}

interface Evaluacion {
  id: number;
  visitaId: number;
  puntualidad: number;
  calidad: number;
  atencion: number;
  comentarios: string;
  fecha: string;
}

export default function HU08_Evaluacion() {
  const [visitas] = useState<Visita[]>([
    { id: 1, servicio: "Mantención preventiva", tecnico: "Carlos Rojas", fecha: "2025-07-09" },
    { id: 2, servicio: "Revisión de ventilador", tecnico: "Laura Soto", fecha: "2025-07-05" },
    { id: 3, servicio: "Cambio de batería", tecnico: "Mario Díaz", fecha: "2025-07-10" }, 
  ]);

  const [visitasRecientes, setVisitasRecientes] = useState<Visita[]>([]);
  const [visitaSeleccionada, setVisitaSeleccionada] = useState<number | "">("");
  const [guardado, setGuardado] = useState(false);

  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);

  const [form, setForm] = useState({
    puntualidad: 0,
    calidad: 0,
    atencion: 0,
    comentarios: "",
  });

  // Verificar visitas en los últimos 7 días
  useEffect(() => {
    const hoy = new Date();
    const recientes = visitas.filter((v) => {
      const fechaVisita = new Date(v.fecha);
      const diferencia = (hoy.getTime() - fechaVisita.getTime()) / (1000 * 60 * 60 * 24);
      return diferencia <= 7;
    });
    setVisitasRecientes(recientes);
  }, [visitas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "comentarios" ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nueva: Evaluacion = {
      id: evaluaciones.length + 1,
      visitaId: Number(visitaSeleccionada),
      puntualidad: form.puntualidad,
      calidad: form.calidad,
      atencion: form.atencion,
      comentarios: form.comentarios,
      fecha: new Date().toISOString().split("T")[0],
    };

    setEvaluaciones([nueva, ...evaluaciones]);
    setForm({ puntualidad: 0, calidad: 0, atencion: 0, comentarios: "" });
    setVisitaSeleccionada("");
    setGuardado(true);
  };

  const visitaActiva = visitasRecientes.find((v) => v.id === Number(visitaSeleccionada));

  if (visitasRecientes.length === 0) {
    return (
      <div className="text-red-600 text-lg font-semibold">
        No tienes visitas finalizadas en los últimos 7 días. No puedes evaluar todavía.
      </div>
    );
  }

  

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Evaluar Servicio Técnico</h1>

    {guardado && (
  <div className="text-green-600 text-lg font-semibold">
    ✅ ¡Gracias por tu evaluación! Ha sido registrada correctamente.
  </div>
)}
      {/* Selección de visita */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <label className="block font-medium">Selecciona la visita que deseas evaluar:</label>
        <select
          value={visitaSeleccionada}
          onChange={(e) => setVisitaSeleccionada(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Seleccionar visita --</option>
          {visitasRecientes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.servicio} - {v.tecnico} ({v.fecha})
            </option>
          ))}
        </select>
      </div>

      {/* Formulario de evaluación */}
      {visitaSeleccionada && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block font-medium">Puntualidad (1 a 5)</label>
            <input
              type="number"
              name="puntualidad"
              min={1}
              max={5}
              value={form.puntualidad}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Calidad del servicio (1 a 5)</label>
            <input
              type="number"
              name="calidad"
              min={1}
              max={5}
              value={form.calidad}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Atención del técnico (1 a 5)</label>
            <input
              type="number"
              name="atencion"
              min={1}
              max={5}
              value={form.atencion}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Comentarios adicionales</label>
            <textarea
              name="comentarios"
              value={form.comentarios}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={3}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Enviar evaluación
          </button>
        </form>
      )}

      {/* Historial de evaluaciones */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Historial de Evaluaciones</h2>
        {evaluaciones.length === 0 ? (
          <p className="text-gray-500">Aún no has realizado evaluaciones.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Visita</th>
                <th className="border px-4 py-2">Puntualidad</th>
                <th className="border px-4 py-2">Calidad</th>
                <th className="border px-4 py-2">Atención</th>
                <th className="border px-4 py-2">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map((ev) => {
                const visita = visitas.find((v) => v.id === ev.visitaId);
                return (
                  <tr key={ev.id}>
                    <td className="border px-4 py-2">{ev.fecha}</td>
                    <td className="border px-4 py-2">
                      {visita?.servicio} - {visita?.tecnico}
                    </td>
                    <td className="border px-4 py-2">{ev.puntualidad}</td>
                    <td className="border px-4 py-2">{ev.calidad}</td>
                    <td className="border px-4 py-2">{ev.atencion}</td>
                    <td className="border px-4 py-2">{ev.comentarios}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
