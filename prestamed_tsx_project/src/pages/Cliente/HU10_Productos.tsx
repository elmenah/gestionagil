import { useState, useEffect } from "react";
import { useContrato } from "../../context/ContratoContext";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  compatibilidad: string;
  estado: "Disponible" | "En uso" | "En mantenimiento" | "Devuelto";
  fichaTecnica: string;
}

export default function HU10_Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [filtroMarca, setFiltroMarca] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Disponible"); // por defecto
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [ultimoContrato, setUltimoContrato] = useState<string | null>(null);

  const { agregarContrato } = useContrato();

  useEffect(() => {
    setTimeout(() => {
      setProductos([
        {
          id: 1,
          nombre: "Monitor multiparamétrico",
          categoria: "Monitor",
          marca: "GE",
          compatibilidad: "Adulto/Pediátrico",
          estado: "Disponible",
          fichaTecnica: "Monitor con pantalla de 15”, ECG, SpO2, y NIBP."
        },
        {
          id: 2,
          nombre: "Bomba de infusión",
          categoria: "Infusión",
          marca: "Philips",
          compatibilidad: "Universal",
          estado: "Disponible",
          fichaTecnica: "Capacidad de 1200 ml/h, doble canal, batería de 8h."
        },
        {
          id: 3,
          nombre: "Cama clínica",
          categoria: "Mobiliario",
          marca: "Hillrom",
          compatibilidad: "Universal",
          estado: "Devuelto",
          fichaTecnica: "Cama eléctrica con posiciones programables y barandas."
        },
        {
          id: 4,
          nombre: "Ventilador mecánico",
          categoria: "Respiratorio",
          marca: "Dräger",
          compatibilidad: "Neonatal/Adulto",
          estado: "Disponible",
          fichaTecnica: "Soporte invasivo y no invasivo con control por volumen."
        },
      ]);
    }, 500);
  }, []);

  const productosFiltrados = productos.filter(
    (p) =>
      p.estado === filtroEstado &&
      (filtroCategoria === "Todos" || p.categoria === filtroCategoria) &&
      (filtroMarca === "Todos" || p.marca === filtroMarca)
  );

  const categorias = Array.from(new Set(productos.map((p) => p.categoria)));
  const marcas = Array.from(new Set(productos.map((p) => p.marca)));
  const estados = Array.from(new Set(productos.map((p) => p.estado)));

  const handleSolicitar = (producto: string) => {
    const nuevoContrato = agregarContrato(producto);
    setUltimoContrato(nuevoContrato.numero);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventario de Productos</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="border px-3 py-2 rounded">
          <option value="Todos">Todas las categorías</option>
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className="border px-3 py-2 rounded">
          <option value="Todos">Todas las marcas</option>
          {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="border px-3 py-2 rounded">
          {estados.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
        </select>
      </div>

      {/* Alerta de confirmación */}
      {ultimoContrato && (
        <div className="bg-green-100 text-green-800 p-4 rounded shadow font-medium">
          ✅ Solicitud enviada correctamente. Número de contrato generado: <strong>{ultimoContrato}</strong>
        </div>
      )}

      {/* Tabla productos */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2">Categoría</th>
              <th className="border px-4 py-2">Marca</th>
              <th className="border px-4 py-2">Compatibilidad</th>
              <th className="border px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td className="border px-4 py-2">{p.nombre}</td>
                <td className="border px-4 py-2">{p.categoria}</td>
                <td className="border px-4 py-2">{p.marca}</td>
                <td className="border px-4 py-2">{p.compatibilidad}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleSolicitar(p.nombre)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    Solicitar
                  </button>
                  <button onClick={() => setProductoSeleccionado(p)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Ficha
                  </button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay productos con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Ficha Técnica */}
      {productoSeleccionado && (
        <div className="bg-gray-100 border-l-4 border-blue-500 p-4 mt-4">
          <h2 className="text-xl font-semibold">Ficha Técnica</h2>
          <p><strong>Producto:</strong> {productoSeleccionado.nombre}</p>
          <p><strong>Categoría:</strong> {productoSeleccionado.categoria}</p>
          <p><strong>Marca:</strong> {productoSeleccionado.marca}</p>
          <p><strong>Compatibilidad:</strong> {productoSeleccionado.compatibilidad}</p>
          <p><strong>Estado:</strong> {productoSeleccionado.estado}</p>
          <p><strong>Especificaciones:</strong> {productoSeleccionado.fichaTecnica}</p>
          <button onClick={() => setProductoSeleccionado(null)} className="mt-2 text-sm text-blue-700 underline">Cerrar</button>
        </div>
      )}
    </div>
  );
}
