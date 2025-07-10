import { useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Visita {
  id: number;
  cliente: string;
  fecha: string;
  equipo: string;
  tareas: string;
  adjuntos?: string[];
  observaciones: string;
  conclusiones: string;
}

export default function HU17_HistorialTecnico() {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [filtroEquipo, setFiltroEquipo] = useState("");
  const [visitaSeleccionada, setVisitaSeleccionada] = useState<Visita | null>(null);

  const visitas: Visita[] = [
    {
      id: 1,
      cliente: "Hospital Central",
      fecha: "2025-06-05",
      equipo: "Monitor de signos",
      tareas: "Revisión general, cambio de cable",
      observaciones: "Equipo funcionando con normalidad tras mantenimiento.",
      conclusiones: "Se recomienda revisión mensual.",
      adjuntos: ["/evidencia1.jpg", "/evidencia2.pdf"],
    },
    {
      id: 2,
      cliente: "Clínica Vida",
      fecha: "2025-06-01",
      equipo: "Bomba de infusión",
      tareas: "Reemplazo de filtro",
      observaciones: "Obstrucción detectada, se reemplazó filtro interno.",
      conclusiones: "Listo para operar.",
    },
  ];

  const visitasFiltradas = visitas.filter((v) => {
    const matchCliente = filtroCliente === "" || v.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
    const matchEquipo = filtroEquipo === "" || v.equipo.toLowerCase().includes(filtroEquipo.toLowerCase());
    const matchFechaInicio = filtroFechaInicio === "" || new Date(v.fecha) >= new Date(filtroFechaInicio);
    const matchFechaFin = filtroFechaFin === "" || new Date(v.fecha) <= new Date(filtroFechaFin);
    return matchCliente && matchEquipo && matchFechaInicio && matchFechaFin;
  });

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Visitas Técnicas");
    worksheet.columns = [
      { header: "Cliente", key: "cliente", width: 25 },
      { header: "Fecha", key: "fecha", width: 15 },
      { header: "Equipo", key: "equipo", width: 20 },
      { header: "Tareas", key: "tareas", width: 30 },
    ];
    visitasFiltradas.forEach((v) => {
      worksheet.addRow({
        cliente: v.cliente,
        fecha: v.fecha,
        equipo: v.equipo,
        tareas: v.tareas,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "historial_visitas.xlsx";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Cliente", "Fecha", "Equipo", "Tareas"]],
      body: visitasFiltradas.map(v => [v.cliente, v.fecha, v.equipo, v.tareas]),
    });
    doc.save("historial_visitas.pdf");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Historial Técnico Personal</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Filtrar por cliente" value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="text" placeholder="Filtrar por equipo" value={filtroEquipo} onChange={(e) => setFiltroEquipo(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="date" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)} className="border px-3 py-2 rounded" />
        <input type="date" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)} className="border px-3 py-2 rounded" />
      </div>

      {/* Botones de exportación */}
      <div className="flex gap-4 mb-4">
        <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Exportar Excel</button>
        <button onClick={exportarPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Exportar PDF</button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Cliente</th>
            <th className="border px-4 py-2 text-left">Fecha</th>
            <th className="border px-4 py-2 text-left">Equipo</th>
            <th className="border px-4 py-2 text-left">Tareas</th>
            <th className="border px-4 py-2 text-left">Ver Detalle</th>
          </tr>
        </thead>
        <tbody>
          {visitasFiltradas.map((v) => (
            <tr key={v.id}>
              <td className="border px-4 py-2">{v.cliente}</td>
              <td className="border px-4 py-2">{v.fecha}</td>
              <td className="border px-4 py-2">{v.equipo}</td>
              <td className="border px-4 py-2">{v.tareas}</td>
              <td className="border px-4 py-2">
                <button onClick={() => setVisitaSeleccionada(v)} className="text-blue-600 hover:underline">Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visitaSeleccionada && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Detalle de la visita</h2>
          <p><strong>Cliente:</strong> {visitaSeleccionada.cliente}</p>
          <p><strong>Fecha:</strong> {visitaSeleccionada.fecha}</p>
          <p><strong>Equipo:</strong> {visitaSeleccionada.equipo}</p>
          <p><strong>Tareas:</strong> {visitaSeleccionada.tareas}</p>
          <p><strong>Observaciones:</strong> {visitaSeleccionada.observaciones}</p>
          <p><strong>Conclusiones:</strong> {visitaSeleccionada.conclusiones}</p>
          {visitaSeleccionada.adjuntos && visitaSeleccionada.adjuntos.length > 0 && (
            <div>
              <h3 className="font-semibold mt-2">Archivos Adjuntos:</h3>
              <ul className="list-disc ml-5">
                {visitaSeleccionada.adjuntos.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Ver archivo {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}