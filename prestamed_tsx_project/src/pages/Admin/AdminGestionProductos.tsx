import { useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  tipo: string;
  estado: "Disponible" | "En mantenimiento" | "Fuera de servicio";
};

const productosFake: Producto[] = [
  { id: 1, nombre: "Monitor de signos vitales", tipo: "Monitor", estado: "Disponible" },
  { id: 2, nombre: "Bomba de infusión", tipo: "Bomba", estado: "En mantenimiento" },
  { id: 3, nombre: "Cama clínica eléctrica", tipo: "Cama", estado: "Fuera de servicio" },
];

export default function AdminGestionProductos() {
  const [productos, setProductos] = useState<Producto[]>(productosFake);
  const [filtro, setFiltro] = useState("");

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    p.tipo.toLowerCase().includes(filtro.toLowerCase()) ||
    p.estado.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleExportExcel = () => {
    alert("📦 Exportar a Excel aún no implementado.");
  };

  const handleExportPDF = () => {
    alert("📄 Exportar a PDF aún no implementado.");
  };

  const handleCrear = () => {
    alert("➕ Crear producto aún no implementado.");
  };

  const handleEditar = (id: number) => {
    alert(`✏️ Editar producto ID: ${id}`);
  };

  const handleEliminar = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Productos</h1>

      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre, tipo o estado"
          className="border px-3 py-2 rounded"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Excel</button>
        <button onClick={handleExportPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">PDF</button>
        <button onClick={handleCrear} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Nuevo Producto</button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Tipo</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.nombre}</td>
              <td className="border px-4 py-2">{p.tipo}</td>
              <td className="border px-4 py-2">{p.estado}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => handleEditar(p.id)} className="text-blue-600 font-medium">Editar</button>
                <button onClick={() => handleEliminar(p.id)} className="text-red-600 font-medium">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
