import { useState } from "react";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: "Cliente" | "Técnico" | "Administrador";
  estado: "Activo" | "Suspendido";
};

export default function GestionClientes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nombre: "Camila Rojas", correo: "camila@prestamed.cl", rol: "Cliente", estado: "Activo" },
    { id: 2, nombre: "Marco Díaz", correo: "marco@prestamed.cl", rol: "Técnico", estado: "Suspendido" },
    { id: 3, nombre: "Ana Fuentes", correo: "ana@prestamed.cl", rol: "Administrador", estado: "Activo" },
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState<Usuario>({
    id: 0,
    nombre: "",
    correo: "",
    rol: "Cliente",
    estado: "Activo",
  });

  const agregarUsuario = () => {
    const nuevoId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    setUsuarios([...usuarios, { ...nuevoUsuario, id: nuevoId }]);
    setNuevoUsuario({ id: 0, nombre: "", correo: "", rol: "Cliente", estado: "Activo" });
  };

  const actualizarUsuario = (id: number, campo: keyof Usuario, valor: string) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, [campo]: valor } : u));
  };

  const eliminarUsuario = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Agregar Usuario</h2>
        <div className="space-y-2">
          <input type="text" placeholder="Nombre" value={nuevoUsuario.nombre}
            onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} className="border p-2 rounded w-full" />
          <input type="email" placeholder="Correo" value={nuevoUsuario.correo}
            onChange={e => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })} className="border p-2 rounded w-full" />
          <select value={nuevoUsuario.rol} onChange={e => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value as Usuario["rol"] })}
            className="border p-2 rounded w-full">
            <option>Cliente</option>
            <option>Técnico</option>
            <option>Administrador</option>
          </select>
          <select value={nuevoUsuario.estado} onChange={e => setNuevoUsuario({ ...nuevoUsuario, estado: e.target.value as Usuario["estado"] })}
            className="border p-2 rounded w-full">
            <option>Activo</option>
            <option>Suspendido</option>
          </select>
          <button onClick={agregarUsuario} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Agregar Usuario
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td className="border p-2">{usuario.nombre}</td>
                <td className="border p-2">{usuario.correo}</td>
                <td className="border p-2">
                  <select value={usuario.rol} onChange={e => actualizarUsuario(usuario.id, "rol", e.target.value)}>
                    <option>Cliente</option>
                    <option>Técnico</option>
                    <option>Administrador</option>
                  </select>
                </td>
                <td className="border p-2">
                  <select value={usuario.estado} onChange={e => actualizarUsuario(usuario.id, "estado", e.target.value)}>
                    <option>Activo</option>
                    <option>Suspendido</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button onClick={() => eliminarUsuario(usuario.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
