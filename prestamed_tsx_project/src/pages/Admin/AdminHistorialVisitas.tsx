import { useState } from "react";

type Visita = {
  id: number;
  cliente: string;
  fecha: string;
  tecnico: string;
  equipo: string;
  diagnostico: string;
  acciones: string;
};

const datos: Visita[] = [
  
  {
    id: 3,
    cliente: "Clínica Vida",
    fecha: "2025-06-08",
    tecnico: "Leandro Mena",
    equipo: "Cama clínica eléctrica",
    diagnostico: "Problema de motor",
    acciones: "Cambio de motor",
  },
  {
    id: 2,
    cliente: "Hospital Central",
    fecha: "2025-06-03",
    tecnico: "Nicolás Mena",
    equipo: "Monitor de signos",
    diagnostico: "Error de calibración",
    acciones: "Calibración y prueba de sistema",
  },
  {
    id: 1,
    cliente: "Clínica Vida",
    fecha: "2025-06-01",
    tecnico: "Ignacio Torres",
    equipo: "Bomba de infusión",
    diagnostico: "Filtro obstruido",
    acciones: "Reemplazo de filtro",
  },
  
];

export default function AdminHistorialVisitas() {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroEquipo, setFiltroEquipo] = useState("");
  const [filtroTecnico, setFiltroTecnico] = useState("");

  const visitasFiltradas = datos.filter((v) =>
    v.cliente.toLowerCase().includes(filtroCliente.toLowerCase()) &&
    v.equipo.toLowerCase().includes(filtroEquipo.toLowerCase()) &&
    v.tecnico.toLowerCase().includes(filtroTecnico.toLowerCase()) &&
    (filtroFecha === "" || v.fecha === filtroFecha)
  );

  const handleExportPDF = () => {
    const ventana = window.open("", "_blank");
    if (!ventana) return;

    const tablaHTML = `
      <html>
        <head>
          <title>Historial de Visitas</title>
        </head>
        <body>
          <h1>Historial de Visitas Técnicas</h1>
          <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Técnico</th>
                <th>Equipo</th>
                <th>Diagnóstico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${visitasFiltradas
                .map(
                  (v) => `
                <tr>
                  <td>${v.cliente}</td>
                  <td>${v.fecha}</td>
                  <td>${v.tecnico}</td>
                  <td>${v.equipo}</td>
                  <td>${v.diagnostico}</td>
                  <td>${v.acciones}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    ventana.document.write(tablaHTML);
    ventana.document.close();
    ventana.print();
  };

  const handleExportExcel = () => {
    const filas = visitasFiltradas.map((v) =>
      [v.cliente, v.fecha, v.tecnico, v.equipo, v.diagnostico, v.acciones].join("\t")
    );
    const contenido = ["Cliente\tFecha\tTécnico\tEquipo\tDiagnóstico\tAcciones", ...filas].join("\n");
    const blob = new Blob([contenido], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Historial_Visitas.xls";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Historial de Visitas Técnicas</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Filtrar por cliente"
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Filtrar por equipo"
          value={filtroEquipo}
          onChange={(e) => setFiltroEquipo(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Filtrar por técnico"
          value={filtroTecnico}
          onChange={(e) => setFiltroTecnico(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Botones de descarga */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleExportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Descargar PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Descargar Excel
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Técnico</th>
              <th className="border px-4 py-2">Equipo</th>
              <th className="border px-4 py-2">Diagnóstico</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visitasFiltradas.map((v) => (
              <tr key={v.id}>
                <td className="border px-4 py-2">{v.cliente}</td>
                <td className="border px-4 py-2">{v.fecha}</td>
                <td className="border px-4 py-2">{v.tecnico}</td>
                <td className="border px-4 py-2">{v.equipo}</td>
                <td className="border px-4 py-2">{v.diagnostico}</td>
                <td className="border px-4 py-2">{v.acciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
