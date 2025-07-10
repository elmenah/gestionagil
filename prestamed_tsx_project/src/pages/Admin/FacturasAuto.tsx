import { useEffect, useState } from "react";

interface Factura {
  id: number;
  cliente: string;
  servicio: string;
  fecha: string;
  costo: number;
}

export default function HU15_FacturasPostServicio() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDescargar = (numero: string) => {
  const link = document.createElement("a");
  link.href = `/pdfs/Factura_${numero}.pdf`; 
  link.download = `Factura_${numero}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  // Simula carga de facturas en menos de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setFacturas([
        {
          id: 1,
          cliente: "Clínica San Pedro",
          servicio: "Mantenimiento de ventilador mecánico",
          fecha: "2025-06-08",
          costo: 145000,
        },
        {
          id: 2,
          cliente: "Hospital Central",
          servicio: "Cambio de batería de monitor cardíaco",
          fecha: "2025-06-06",
          costo: 98000,
        },
        {
          id: 3,
          cliente: "Centro Médico Vida",
          servicio: "Calibración de bomba de infusión",
          fecha: "2025-06-04",
          costo: 110000,
        },
      ]);
      setLoading(false);
    }, 3000); // ⚡ < 5 segundos

    return () => clearTimeout(timer);
  }, []);

 

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-3xl font-bold">Facturación Post-Servicio</h1>

      {loading ? (
        <p className="text-gray-500">Cargando facturas generadas...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Servicio</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Costo</th>
              <th className="border px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((f) => (
              <tr key={f.id}>
                <td className="border px-4 py-2">{f.cliente}</td>
                <td className="border px-4 py-2">{f.servicio}</td>
                <td className="border px-4 py-2">{f.fecha}</td>
                <td className="border px-4 py-2">
                  ${f.costo.toLocaleString()} CLP
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDescargar("123")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
