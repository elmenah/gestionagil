import { useState } from "react";
import { useContrato } from "../../context/ContratoContext";

export default function HU09_Contratos() {
  const { contratos, firmarContrato } = useContrato();

  const [filtroEstado, setFiltroEstado] = useState<"Todos" | "Activo" | "Finalizado">("Todos");
  const [contratoSeleccionado, setContratoSeleccionado] = useState<typeof contratos[0] | null>(null);

  const contratosFiltrados = contratos.filter((c) =>
    filtroEstado === "Todos" ? true : c.estado === filtroEstado
  );

 const handleDescargar = (numero: string) => {
  const link = document.createElement("a");
  link.href = `/pdfs/Contrato_${numero}.pdf`; // Asegúrate que la ruta sea correcta
  link.download = `Contrato_${numero}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const handleFirmar = async (id: number) => {
    firmarContrato(id);
    alert("✅ Contrato firmado correctamente.");
    // Buscar el contrato firmado
    const contrato = contratos.find((c) => c.id === id);
    if (contrato) {
      // Enviar correo al cliente usando Netlify Function
      try {
        await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: contrato.email,
            subject: `Contrato firmado: ${contrato.numero}`,
            html: `<h2>¡Su contrato ha sido firmado!</h2><p>Número: <b>${contrato.numero}</b></p><p>Producto: ${contrato.producto}</p><p>Fecha inicio: ${contrato.fechaInicio}</p><p>Fecha fin: ${contrato.fechaFin}</p><p>Gracias por confiar en PrestaMed.</p>`
          })
        });
      } catch (err) {
        alert('No se pudo enviar el correo de confirmación.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Contratos</h1>

      <div className="flex items-center space-x-4">
        <label className="font-medium">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as any)}
          className="border px-3 py-2 rounded"
        >
          <option value="Todos">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">N° Contrato</th>
              <th className="border px-4 py-2">Inicio</th>
              <th className="border px-4 py-2">Fin</th>
              <th className="border px-4 py-2">Producto</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Firma</th>
              <th className="border px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {contratosFiltrados.map((contrato) => (
              <tr key={contrato.id}>
                <td className="border px-4 py-2">{contrato.numero}</td>
                <td className="border px-4 py-2">{contrato.fechaInicio}</td>
                <td className="border px-4 py-2">{contrato.fechaFin}</td>
                <td className="border px-4 py-2">{contrato.producto || "-"}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      contrato.estado === "Activo" ? "bg-green-600" : "bg-gray-500"
                    }`}
                  >
                    {contrato.estado}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {contrato.firmado ? (
                    <span className="text-green-600 font-semibold">
                      Firmado el {contrato.fechaFirma}
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">No firmado</span>
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleDescargar("12345")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    PDF
                  </button>
                  {contrato.estado === "Activo" && !contrato.firmado && (
                    <button
                      onClick={() => setContratoSeleccionado(contrato)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Firmar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 MODAL DE FIRMA */}
      {contratoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-lg">
            <h2 className="text-xl font-bold mb-4">Detalles del Contrato</h2>
            <p><strong>N°:</strong> {contratoSeleccionado.numero}</p>
            <p><strong>Producto:</strong> {contratoSeleccionado.producto}</p>
            <p><strong>Fecha inicio:</strong> {contratoSeleccionado.fechaInicio}</p>
            <p><strong>Fecha fin:</strong> {contratoSeleccionado.fechaFin}</p>
            
            <p className="mt-4 text-sm text-gray-600">
              Cláusula 1: El equipo debe ser devuelto en buen estado.<br />
              Cláusula 2: El mantenimiento preventivo será realizado por PrestaMed cada 3 meses.<br />
              Cláusula 3: En caso de falla, contactar soporte inmediatamente.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setContratoSeleccionado(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => {
                  handleFirmar(contratoSeleccionado.id);
                  setContratoSeleccionado(null);
                }}
              >
                Confirmar Firma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
