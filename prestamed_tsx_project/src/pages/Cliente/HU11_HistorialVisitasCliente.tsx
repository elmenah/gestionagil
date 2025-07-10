import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface VisitaTecnica {
  id: number;
  fecha: string;
  tecnico: string;
  equipo: string;
  contrato: string;
}

const visitasFake: VisitaTecnica[] = [
  {
    id: 1,
    fecha: "2025-06-01",
    tecnico: "Laura Soto",
    equipo: "Monitor multiparamétrico",
    contrato: "CT-00123",
  },
  {
    id: 2,
    fecha: "2025-05-25",
    tecnico: "Carlos Méndez",
    equipo: "Ventilador mecánico",
    contrato: "CT-00123",
  },
  {
    id: 3,
    fecha: "2025-05-18",
    tecnico: "Ana Ruiz",
    equipo: "Bomba de infusión",
    contrato: "CT-00127",
  },
];

export default function HU11_HistorialVisitasCliente() {
  const [filtroContrato, setFiltroContrato] = useState<string>("Todos");

  const contratosUnicos = Array.from(new Set(visitasFake.map((v) => v.contrato)));

  const visitasFiltradas =
    filtroContrato === "Todos"
      ? visitasFake
      : visitasFake.filter((v) => v.contrato === filtroContrato);

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Visitas Técnicas", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Fecha", "Técnico", "Equipo", "Contrato"]],
      body: visitasFiltradas.map((v) => [v.fecha, v.tecnico, v.equipo, v.contrato]),
    });
    doc.save("historial_visitas.pdf");
  };

  const descargarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Visitas");
    worksheet.columns = [
      { header: "Fecha", key: "fecha", width: 15 },
      { header: "Técnico", key: "tecnico", width: 20 },
      { header: "Equipo", key: "equipo", width: 25 },
      { header: "Contrato", key: "contrato", width: 15 },
    ];
    visitasFiltradas.forEach((v) => {
      worksheet.addRow(v);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "historial_visitas.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Historial de Visitas Técnicas</h1>
        <div className="space-x-2">
          <button
            onClick={descargarPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Descargar PDF
          </button>
          <button
            onClick={descargarExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Descargar Excel
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <label className="font-medium">Filtrar por contrato:</label>
        <select
          value={filtroContrato}
          onChange={(e) => setFiltroContrato(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="Todos">Todos</option>
          {contratosUnicos.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Fecha</th>
              <th className="border px-4 py-2 text-left">Técnico</th>
              <th className="border px-4 py-2 text-left">Equipo</th>
              <th className="border px-4 py-2 text-left">Contrato</th>
            </tr>
          </thead>
          <tbody>
            {visitasFiltradas.map((v) => (
              <tr key={v.id}>
                <td className="border px-4 py-2">{v.fecha}</td>
                <td className="border px-4 py-2">{v.tecnico}</td>
                <td className="border px-4 py-2">{v.equipo}</td>
                <td className="border px-4 py-2">{v.contrato}</td>
              </tr>
            ))}
            {visitasFiltradas.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No hay visitas para este contrato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
