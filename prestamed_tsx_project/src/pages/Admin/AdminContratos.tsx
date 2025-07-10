import { useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";

type Contrato = {
  id: number;
  cliente: string;
  equipo: string;
  numero: string;
  fechaInicio: string;
  fechaFin: string;
  estado: "Activo" | "Finalizado";
};

const contratosFake: Contrato[] = [
  {
    id: 1,
    cliente: "Clínica Vida",
    equipo: "Monitor multiparamétrico",
    numero: "CT-00123",
    fechaInicio: "2025-02-01",
    fechaFin: "2025-06-15",
    estado: "Activo",
  },
  {
    id: 2,
    cliente: "Hospital Central",
    equipo: "Bomba de infusión",
    numero: "CT-00110",
    fechaInicio: "2024-09-01",
    fechaFin: "2025-03-01",
    estado: "Finalizado",
  },
];

export default function AdminContratos() {
  const [clienteFiltro, setClienteFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<"Todos" | "Activo" | "Finalizado">("Todos");

  const contratosFiltrados = contratosFake.filter((c) =>
    c.cliente.toLowerCase().includes(clienteFiltro.toLowerCase()) &&
    (estadoFiltro === "Todos" || c.estado === estadoFiltro)
  );

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Contratos");
    worksheet.columns = [
      { header: "Cliente", key: "cliente", width: 25 },
      { header: "Equipo", key: "equipo", width: 25 },
      { header: "Contrato", key: "numero", width: 15 },
      { header: "Inicio", key: "fechaInicio", width: 15 },
      { header: "Fin", key: "fechaFin", width: 15 },
      { header: "Estado", key: "estado", width: 15 },
    ];
    contratosFiltrados.forEach((c) => {
      worksheet.addRow(c);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "contratos_prestamed.xlsx";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Contratos", 14, 14);
    (doc as any).autoTable({
      startY: 20,
      head: [["Cliente", "Equipo", "Contrato", "Inicio", "Fin", "Estado"]],
      body: contratosFiltrados.map((c) => [
        c.cliente,
        c.equipo,
        c.numero,
        c.fechaInicio,
        c.fechaFin,
        c.estado,
      ]),
    });
    doc.save("contratos_prestamed.pdf");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Contratos</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Filtrar por cliente"
          value={clienteFiltro}
          onChange={(e) => setClienteFiltro(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as any)}
          className="border px-3 py-2 rounded"
        >
          <option value="Todos">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Finalizado">Finalizado</option>
        </select>

        <button
          onClick={exportarExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📥 Descargar Excel
        </button>

        <button
          onClick={exportarPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📄 Descargar PDF
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Equipo</th>
              <th className="border px-4 py-2">Contrato</th>
              <th className="border px-4 py-2">Inicio</th>
              <th className="border px-4 py-2">Fin</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {contratosFiltrados.map((c) => (
              <tr key={c.id}>
                <td className="border px-4 py-2">{c.cliente}</td>
                <td className="border px-4 py-2">{c.equipo}</td>
                <td className="border px-4 py-2">{c.numero}</td>
                <td className="border px-4 py-2">{c.fechaInicio}</td>
                <td className="border px-4 py-2">{c.fechaFin}</td>
                <td className="border px-4 py-2">{c.estado}</td>
              </tr>
            ))}
            {contratosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No hay contratos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
