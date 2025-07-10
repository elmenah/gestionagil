import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Link } from "react-router-dom"; // Asumiendo que usas React Router para la navegación

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface Equipo {
  id: number;
  nombre: string;
  tipo: string;
  estado: "Funcionando" | "En mantenimiento" | "Fuera de servicio";
  ubicacion: string;
  proximoMantenimiento: string; // Formato YYYY-MM-DD
  // Añadimos una propiedad para la última visita y tiempo de atención para simular
  ultimaVisita?: string; // Fecha de la última visita
  tiempoAtencionHs?: number; // Horas de atención en la última visita
}

// Estados posibles de los equipos
const ESTADOS: Equipo["estado"][] = ["Funcionando", "En mantenimiento", "Fuera de servicio"];

export default function DashboardTecnico() {
  const [filtro, setFiltro] = useState("mes"); // Filtro de tiempo para gráficos
  const [equipos, setEquipos] = useState<Equipo[]>([
    {
      id: 1,
      nombre: "Monitor cardíaco",
      tipo: "Monitor",
      estado: "Funcionando",
      ubicacion: "Clínica San Pedro",
      proximoMantenimiento: "2025-06-18",
      ultimaVisita: "2025-05-10",
      tiempoAtencionHs: 2.5,
    },
    {
      id: 2,
      nombre: "Bomba de infusión",
      tipo: "Bomba",
      estado: "En mantenimiento",
      ubicacion: "Hospital Central",
      proximoMantenimiento: "2025-06-20",
      ultimaVisita: "2025-05-15",
      tiempoAtencionHs: 4.0,
    },
    {
      id: 3,
      nombre: "Ventilador mecánico",
      tipo: "Ventilador",
      estado: "Fuera de servicio",
      ubicacion: "Clínica Vida",
      proximoMantenimiento: "2025-06-17", // Próximo mantenimiento ya pasado o muy cercano
      ultimaVisita: "2025-06-01",
      tiempoAtencionHs: 1.0,
    },
    {
      id: 4,
      nombre: "Cama clínica eléctrica",
      tipo: "Cama",
      estado: "Funcionando",
      ubicacion: "Hospital del Sur",
      proximoMantenimiento: "2025-07-01",
      ultimaVisita: "2025-05-22",
      tiempoAtencionHs: 3.0,
    },
    {
      id: 5,
      nombre: "Equipo de Rayos X",
      tipo: "Imágenes",
      estado: "Funcionando",
      ubicacion: "Clínica San Pedro",
      proximoMantenimiento: "2025-06-16", // Mantenimiento para hoy
      ultimaVisita: "2025-04-20",
      tiempoAtencionHs: 5.0,
    },
    {
      id: 6,
      nombre: "Electrocardiógrafo",
      tipo: "Diagnóstico",
      estado: "En mantenimiento",
      ubicacion: "Centro Médico ABC",
      proximoMantenimiento: "2025-06-25",
      ultimaVisita: "2025-05-28",
      tiempoAtencionHs: 2.0,
    },
    {
      id: 7,
      nombre: "Autoclave",
      tipo: "Esterilización",
      estado: "Funcionando",
      ubicacion: "Hospital Central",
      proximoMantenimiento: "2025-07-10",
      ultimaVisita: "2025-05-05",
      tiempoAtencionHs: 3.5,
    },
  ]);

  // --- Lógica para KPIs y datos de gráficos ---
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día para comparaciones

  // Filtrar equipos con alertas (Fuera de servicio o próximo mantenimiento en 7 días o ya vencido)
  const alertas = equipos.filter((e) => {
    const fechaMant = new Date(e.proximoMantenimiento + 'T00:00:00'); // Asegura que la fecha se interprete correctamente
    fechaMant.setHours(0, 0, 0, 0);
    const diff = (fechaMant.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return e.estado === "Fuera de servicio" || diff < 7; // Incluye hoy y días pasados si no se marcó "hecho"
  });

  // Equipos con mantenimiento próximo (solo los que están por vencer o vencidos)
  const equiposProximoMantenimiento = equipos.filter((e) => {
    const fechaMant = new Date(e.proximoMantenimiento + 'T00:00:00');
    fechaMant.setHours(0, 0, 0, 0);
    const diff = (fechaMant.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 7 && e.estado !== "Fuera de servicio"; // Próximos 7 días o ya vencido, pero no "fuera de servicio"
  });

  // Calcular visitas del mes actual (simulado con la última visita)
  const mesActual = hoy.getMonth(); // 0 para Enero, 11 para Diciembre
  const añoActual = hoy.getFullYear();

  const visitasMesActual = equipos.filter(e => {
    if (!e.ultimaVisita) return false;
    const fechaUltimaVisita = new Date(e.ultimaVisita + 'T00:00:00');
    return fechaUltimaVisita.getMonth() === mesActual && fechaUltimaVisita.getFullYear() === añoActual;
  }).length;

  // Calcular tiempo promedio de atención (simulado)
  const totalTiempoAtencion = equipos.reduce((sum, e) => sum + (e.tiempoAtencionHs || 0), 0);
  const equiposConAtencion = equipos.filter(e => e.tiempoAtencionHs !== undefined).length;
  const promedioTiempoAtencion = equiposConAtencion > 0 ? (totalTiempoAtencion / equiposConAtencion).toFixed(1) : 0;


  // Datos para gráficos
  const visitasPorMes = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Visitas Realizadas",
        data: [8, 10, 12, 11, 14, visitasMesActual], // Usar visitasMesActual para el mes actual
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Objetivo Mensual",
        data: [10, 12, 12, 13, 15, 15], // Ejemplo de datos de objetivo
        backgroundColor: "#FFCE56",
      },
    ],
  };

  const distribucionEstado = {
    labels: ["Funcionando", "En mantenimiento", "Fuera de servicio"],
    datasets: [
      {
        data: [
          equipos.filter((e) => e.estado === "Funcionando").length,
          equipos.filter((e) => e.estado === "En mantenimiento").length,
          equipos.filter((e) => e.estado === "Fuera de servicio").length,
        ],
        backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
      },
    ],
  };

  const ubicaciones = Array.from(new Set(equipos.map((e) => e.ubicacion)));
  const tipos = Array.from(new Set(equipos.map((e) => e.tipo)));

  // Estados para filtros de tabla
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroUbicacion, setFiltroUbicacion] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  // Lógica de filtrado para la tabla de equipos
  const equiposFiltrados = equipos.filter((e) => {
    return (
      (filtroEstado === "Todos" || e.estado === filtroEstado) &&
      (filtroUbicacion === "Todos" || e.ubicacion === filtroUbicacion) &&
      (filtroTipo === "Todos" || e.tipo === filtroTipo)
    );
  });

  // Helper para determinar si el mantenimiento está vencido o muy próximo
  const isMaintenanceCritical = (dateString: string) => {
    const maintenanceDate = new Date(dateString + 'T00:00:00');
    maintenanceDate.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    const diff = (maintenanceDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 0 ? "overdue" : (diff <= 7 ? "imminent" : ""); // "overdue", "imminent", or ""
  };

  // Simular acción de iniciar mantenimiento
  const iniciarMantenimiento = (id: number) => {
    alert(`Iniciando mantenimiento para equipo ID: ${id}`);
    // Aquí iría la lógica para cambiar el estado del equipo en tu DB/estado global
    // Por ejemplo: setEquipos(equipos.map(e => e.id === id ? { ...e, estado: "En mantenimiento" } : e));
  };

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Técnico</h1>
      <div className="flex flex-wrap gap-4">
        <Link to="/tecnico/calendario-visitas" className="btn">Calendario De Visitas</Link>
        <Link to="/tecnico/historial-tecnico" className="btn">Historial Tecnico</Link>
        <Link to="/tecnico/inventario" className="btn">Inventario</Link>
        <Link to="/tecnico/reporte-visita" className="btn">Reporte de Visita</Link>
        
      </div>

     

      {/* 🔹 Filtros de tabla */}
      <div className="flex flex-wrap gap-3 p-3 bg-white rounded-lg shadow-md">
        <span className="font-semibold text-gray-700 self-center">Filtrar tabla:</span>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as Equipo["estado"] | "Todos")}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Todos">Todos los estados</option>
          {ESTADOS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filtroUbicacion}
          onChange={(e) => setFiltroUbicacion(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Todos">Todas las ubicaciones</option>
          {ubicaciones.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Todos">Todos los tipos</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* 🔹 Alertas del Sistema - Más prominente y con acciones */}
      {alertas.length > 0 && (
        <div className="bg-red-50 border border-red-400 text-red-800 p-4 rounded-lg shadow-md animate-pulse">
          <h2 className="font-bold text-lg mb-2 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.542 2.714-1.542 3.479 0l5.58 11.25A1.5 1.5 0 0117.62 16H2.38a1.5 1.5 0 01-1.638-2.25l5.58-11.25zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-7a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd"></path></svg>
            Alertas Críticas del Sistema
          </h2>
          <ul className="list-disc ml-5 space-y-2 text-gray-700">
            {alertas.map((a) => (
              <li key={a.id}>
                {a.estado === "Fuera de servicio" ? (
                  <>
                    <strong className="text-red-700">⚠️ {a.nombre}</strong> en <strong className="text-red-700">{a.ubicacion}</strong> está <strong>fuera de servicio</strong>.
                  </>
                ) : (
                  <>
                    <strong className="text-orange-700">🔧 Mantenimiento próximo</strong> para <strong>{a.nombre}</strong> en <strong>{a.ubicacion}</strong> ({a.proximoMantenimiento}).
                  </>
                )}
                <div className="inline-flex ml-4 gap-2">
                  <Link to={`/equipo/${a.id}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                    Ver Detalles
                  </Link>
                  <button
                    onClick={() => iniciarMantenimiento(a.id)}
                    className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                  >
                    Iniciar Mantenimiento
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Tabla de Equipos - Con visualización de estado y acciones */}
      <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Estado de Equipos</h2>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-left">
              <th className="px-4 py-2 border-b-2 border-gray-200">Nombre</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Tipo</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Estado</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Ubicación</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Próximo Mantenimiento</th>
              <th className="px-4 py-2 border-b-2 border-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equiposFiltrados.map((e) => {
              const maintenanceStatus = isMaintenanceCritical(e.proximoMantenimiento);
              return (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 px-4 py-2">{e.nombre}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{e.tipo}</td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        e.estado === "Funcionando"
                          ? "bg-green-100 text-green-800"
                          : e.estado === "En mantenimiento"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {e.estado}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">{e.ubicacion}</td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    <span
                      className={`${
                        maintenanceStatus === "overdue"
                          ? "text-red-600 font-bold"
                          : maintenanceStatus === "imminent"
                          ? "text-orange-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {e.proximoMantenimiento}
                      {maintenanceStatus === "overdue" && " (Vencido)"}
                      {maintenanceStatus === "imminent" && " (Próximo)"}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/equipo/${e.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Ver
                      </Link>
                      {e.estado !== "Fuera de servicio" && ( // Opción para iniciar mantenimiento si no está fuera de servicio
                         <button
                         onClick={() => iniciarMantenimiento(e.id)}
                         className="text-purple-600 hover:text-purple-800 text-sm"
                       >
                         Mantenimiento
                       </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔹 Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Visitas Técnicas por Mes (Actual vs. Objetivo)</h2>
          <Bar data={visitasPorMes} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Distribución de Estado de Equipos</h2>
          <Pie data={distribucionEstado} />
        </div>
      </div>
    </div>
  );
}