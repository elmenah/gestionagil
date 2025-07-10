import { useState } from "react";

interface Contrato {
  id: number;
  numero: string;
  cliente: string;
  tipoEquipo: string;
  fechaVencimiento: string;
  estado: "Pendiente" | "Solicitud enviada";
  renovacion?: {
    meses: number;
    fechaSolicitada: string;
  };
}

export default function HU07_Renovacion() {
  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: 1,
      numero: "CT-00849",
      cliente: "Hospital Central",
      tipoEquipo: "Monitor multiparamétrico",
      fechaVencimiento: "2025-06-15",
      estado: "Pendiente",
    },
    {
      id: 2,
      numero: "CT-00378",
      cliente: "Hospital Central",
      tipoEquipo: "Ventilador mecánico",
      fechaVencimiento: "2025-06-25",
      estado: "Pendiente",
    },
    {
      id: 2,
      numero: "CT-00123",
      cliente: "Hospital Central",
      tipoEquipo: "Bomba de infusión",
      fechaVencimiento: "2025-06-25",
      estado: "Pendiente",
    },
  ]);

  const [duracion, setDuracion] = useState<{ [key: number]: number }>({});

  const handleRenovar = (id: number) => {
    if (!duracion[id]) {
      alert("Por favor, selecciona una duración para la renovación.");
      return;
    }

    const ahora = new Date().toLocaleString();

    setContratos(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              estado: "Solicitud enviada",
              renovacion: {
                meses: duracion[id],
                fechaSolicitada: ahora,
              },
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Renovación de Contratos</h1>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Contratos próximos a vencer</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">N° Contrato</th>
              <th className="border px-4 py-2">Equipo</th>
              <th className="border px-4 py-2">Fecha Vencimiento</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Duración deseada</th>
              <th className="border px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((contrato) => (
              <tr key={contrato.id}>
                <td className="border px-4 py-2">{contrato.numero}</td>
                <td className="border px-4 py-2">{contrato.tipoEquipo}</td>
                <td className="border px-4 py-2">{contrato.fechaVencimiento}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      contrato.estado === "Pendiente" ? "bg-yellow-500" : "bg-green-600"
                    }`}
                  >
                    {contrato.estado}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {contrato.estado === "Pendiente" ? (
                    <select
                      value={duracion[contrato.id] || ""}
                      onChange={(e) =>
                        setDuracion({ ...duracion, [contrato.id]: Number(e.target.value) })
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Seleccionar</option>
                      <option value={3}>3 meses</option>
                      <option value={6}>6 meses</option>
                      <option value={12}>12 meses</option>
                    </select>
                  ) : (
                    contrato.renovacion && `${contrato.renovacion.meses} meses`
                  )}
                </td>
                <td className="border px-4 py-2">
                  {contrato.estado === "Pendiente" ? (
                    <button
                      onClick={() => handleRenovar(contrato.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Solicitar renovación
                    </button>
                  ) : (
                    <span className="text-green-600 font-semibold text-sm">
                      Enviada el {contrato.renovacion?.fechaSolicitada}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
