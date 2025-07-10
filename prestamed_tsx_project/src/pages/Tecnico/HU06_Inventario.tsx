import { useEffect, useState } from "react";

interface ItemInventario {
  id: number;
  nombre: string;
  cantidad: number;
  categoria: string;
  compatibleCon: string[];
  estado: "Operativo" | "En mantenimiento" | "Retirado";
}

interface HistorialCambio {
  id: number;
  itemId: number;
  nombre: string;
  fecha: string;
  cantidadAnterior: number;
  cantidadNueva: number;
}

export default function HU06_Inventario() {
  const [inventario, setInventario] = useState<ItemInventario[]>([
    {
      id: 1,
      nombre: "Filtro de oxígeno",
      cantidad: 3,
      categoria: "Respiratorio",
      compatibleCon: ["Ventilador mecánico"],
      estado: "Operativo",
    },
    {
      id: 2,
      nombre: "Sensor de pulso",
      cantidad: 1,
      categoria: "Monitoreo",
      compatibleCon: ["Monitor de signos vitales"],
      estado: "Operativo",
    },
  ]);

  const [historial, setHistorial] = useState<HistorialCambio[]>([]);
  const [ediciones, setEdiciones] = useState<{ [id: number]: number }>({});
  const [alertas, setAlertas] = useState<string[]>([]);
  const STOCK_CRITICO = 2;

  useEffect(() => {
    const nuevasAlertas = inventario
      .filter((item) => item.cantidad <= STOCK_CRITICO)
      .map(
        (item) =>
          `⚠️ Stock crítico: "${item.nombre}" tiene solo ${item.cantidad} unidad(es).`
      );
    setAlertas(nuevasAlertas);
  }, [inventario]);

  const handleCantidadInput = (id: number, nuevaCantidad: number) => {
    setEdiciones((prev) => ({ ...prev, [id]: nuevaCantidad }));
  };

  const confirmarCambio = (item: ItemInventario) => {
    const nuevaCantidad = ediciones[item.id];
    if (nuevaCantidad === undefined || nuevaCantidad === item.cantidad) return;

    const cambio: HistorialCambio = {
      id: historial.length + 1,
      itemId: item.id,
      nombre: item.nombre,
      fecha: new Date().toLocaleString(),
      cantidadAnterior: item.cantidad,
      cantidadNueva: nuevaCantidad,
    };

    setHistorial((prev) => [cambio, ...prev]);

    setInventario((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, cantidad: nuevaCantidad } : i))
    );

    const updated = { ...ediciones };
    delete updated[item.id];
    setEdiciones(updated);
  };

  const eliminarItem = (id: number) => {
    setInventario((prev) => prev.filter((item) => item.id !== id));
    const updated = { ...ediciones };
    delete updated[id];
    setEdiciones(updated);
  };

const [nuevoRepuesto, setNuevoRepuesto] = useState({
  nombre: "",
  cantidad: 0,
  categoria: "",
  compatibleCon: "",
  estado: "Operativo" as "Operativo" | "En mantenimiento" | "Retirado",
});

// ➕ Agregar nuevo repuesto
const agregarRepuesto = () => {
  const nuevoItem: ItemInventario = {
    id: inventario.length + 1,
    nombre: nuevoRepuesto.nombre,
    cantidad: nuevoRepuesto.cantidad,
    categoria: nuevoRepuesto.categoria,
    compatibleCon: nuevoRepuesto.compatibleCon.split(",").map(c => c.trim()),
    estado: nuevoRepuesto.estado,
  };
  setInventario([...inventario, nuevoItem]);
  setNuevoRepuesto({
    nombre: "",
    cantidad: 0,
    categoria: "",
    compatibleCon: "",
    estado: "Operativo",
  });
};


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestión de Inventario de Repuestos</h1>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded space-y-2">
          <h2 className="font-semibold">Alertas de stock crítico:</h2>
          <ul className="list-disc ml-6">
            {alertas.map((alerta, idx) => (
              <li key={idx}>{alerta}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded shadow p-4 space-y-2">
  <h2 className="text-xl font-semibold">Agregar Repuesto</h2>
  <input className="border p-2 w-full" placeholder="Nombre"
    value={nuevoRepuesto.nombre}
    onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, nombre: e.target.value })} />
  <input className="border p-2 w-full" type="number" placeholder="Cantidad"
    value={nuevoRepuesto.cantidad}
    onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, cantidad: Number(e.target.value) })} />
  <input className="border p-2 w-full" placeholder="Categoría"
    value={nuevoRepuesto.categoria}
    onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, categoria: e.target.value })} />
  <input className="border p-2 w-full" placeholder="Compatible con (separado por coma)"
    value={nuevoRepuesto.compatibleCon}
    onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, compatibleCon: e.target.value })} />
  
  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={agregarRepuesto}>
    Agregar Repuesto
  </button>
</div>

      {/* Inventario */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Inventario actual</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border px-3 py-2">Repuesto</th>
              <th className="border px-3 py-2">Cantidad</th>
              <th className="border px-3 py-2">Categoría</th>
              <th className="border px-3 py-2">Compatible con</th>
              
              <th className="border px-3 py-2">Editar</th>
              <th className="border px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((item) => (
              <tr key={item.id} className="text-sm">
                <td className="border px-3 py-2">{item.nombre}</td>
                <td className="border px-3 py-2">{item.cantidad}</td>
                <td className="border px-3 py-2">{item.categoria}</td>
                <td className="border px-3 py-2">{item.compatibleCon.join(", ")}</td>
                
                <td className="border px-3 py-2">
                  <input
                    type="number"
                    className="w-20 border rounded px-2 py-1"
                    value={ediciones[item.id] ?? item.cantidad}
                    onChange={(e) =>
                      handleCantidadInput(item.id, Number(e.target.value))
                    }
                  />
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => confirmarCambio(item)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Confirmar
                  </button>
                  {(ediciones[item.id] ?? item.cantidad) === 0 && (
                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Historial */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Historial de cambios</h2>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Repuesto</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Cantidad anterior</th>
              <th className="border px-4 py-2">Cantidad nueva</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((entry) => (
              <tr key={entry.id}>
                <td className="border px-4 py-2">{entry.nombre}</td>
                <td className="border px-4 py-2">{entry.fecha}</td>
                <td className="border px-4 py-2">{entry.cantidadAnterior}</td>
                <td className="border px-4 py-2">{entry.cantidadNueva}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
