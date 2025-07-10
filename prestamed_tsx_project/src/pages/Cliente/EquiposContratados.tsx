import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface EquipoContratado {
  id: number;
  nombre: string;
  tipo: string;
  estado: "Funcionando" | "En mantenimiento" | "Fuera de servicio";
  ubicacion: string;
  fechaArriendo: string;
  vencimiento: string;
}

export default function EquiposContratados() {
  const [equipos, setEquipos] = useState<EquipoContratado[]>([]);

  useEffect(() => {
    setEquipos([
      {
        id: 1,
        nombre: "Monitor de signos vitales",
        tipo: "Monitor",
        estado: "Funcionando",
        ubicacion: "Clínica Vida",
        fechaArriendo: "2025-04-10",
        vencimiento: "2025-08-10",
      },
      {
        id: 2,
        nombre: "Bomba de infusión",
        tipo: "Bomba",
        estado: "En mantenimiento",
        ubicacion: "Hospital Central",
        fechaArriendo: "2025-03-15",
        vencimiento: "2025-09-15",
      },
      {
        id: 3,
        nombre: "Desfibrilador",
        tipo: "Cardiología",
        estado: "Funcionando",
        ubicacion: "Clínica Alemana",
        fechaArriendo: "2025-02-01",
        vencimiento: "2025-07-01",
      },
      {
        id: 4,
        nombre: "Ventilador mecánico",
        tipo: "Respiratorio",
        estado: "Fuera de servicio",
        ubicacion: "Hospital del Sur",
        fechaArriendo: "2025-01-20",
        vencimiento: "2025-06-20",
      },
    ]);
  }, []);

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.text("Equipos Arrendados", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Nombre", "Tipo", "Estado", "Ubicación", "Arriendo", "Vencimiento"]],
      body: equipos.map((eq) => [
        eq.nombre,
        eq.tipo,
        eq.estado,
        eq.ubicacion,
        eq.fechaArriendo,
        eq.vencimiento,
      ]),
    });
    doc.save("equipos_arrendados.pdf");
  };

  const descargarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Equipos");
    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "Tipo", key: "tipo", width: 20 },
      { header: "Estado", key: "estado", width: 20 },
      { header: "Ubicación", key: "ubicacion", width: 25 },
      { header: "Arriendo", key: "fechaArriendo", width: 15 },
      { header: "Vencimiento", key: "vencimiento", width: 15 },
    ];
    equipos.forEach((eq) => {
      worksheet.addRow(eq);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "equipos_arrendados.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Mis Equipos Arrendados</h1>
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

      <table className="w-full table-auto border-collapse bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Tipo</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Ubicación</th>
            <th className="border px-4 py-2">Fecha Arriendo</th>
            <th className="border px-4 py-2">Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((eq) => (
            <tr key={eq.id}>
              <td className="border px-4 py-2">{eq.nombre}</td>
              <td className="border px-4 py-2">{eq.tipo}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    eq.estado === "Funcionando"
                      ? "bg-green-600"
                      : eq.estado === "En mantenimiento"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {eq.estado}
                </span>
              </td>
              <td className="border px-4 py-2">{eq.ubicacion}</td>
              <td className="border px-4 py-2">{eq.fechaArriendo}</td>
              <td className="border px-4 py-2">{eq.vencimiento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
