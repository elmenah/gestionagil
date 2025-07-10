import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";

// Colores para pie chart de estado de equipos (ya existente)
const coloresEstadoEquipo = ["#22c55e", "#facc15", "#ef4444"]; // Funcionando, En mantenimiento, Fallando

// Nuevos colores para estado de tickets
const coloresEstadoTickets = ["#0ea5e9", "#f97316", "#a855f7", "#10b981"]; // Abiertos, En Proceso, En Espera Cliente, Cerrados Recientes

// Colores para estado de contratos
const coloresEstadoContratos = ["#36A2EB", "#FFCE56", "#FF6384"]; // Vigente, Próximo a Vencer, Vencido

export default function HU02_Dashboard() {
  const [filtro, setFiltro] = useState("mes"); // Default filter for time-based charts

  // Simulación de equipos asignados
  const [equipos] = useState([
    { id: 1, tipo: "Monitor", estado: "Funcionando" },
    { id: 2, tipo: "Bomba", estado: "En mantenimiento" },
    { id: 3, tipo: "Ventilador", estado: "Funcionando" },
    { id: 4, tipo: "Electrocardiógrafo", estado: "Funcionando" },
    { id: 5, tipo: "Desfibrilador", estado: "En mantenimiento" },
    { id: 6, tipo: "Bomba", estado: "Funcionando" },
    { id: 7, tipo: "Monitor", estado: "Fallando" },
  ]);

  // Simulación de tickets de soporte
  const [ticketsSoporte] = useState([
    { id: "TKT-001", asunto: "Fallo de Bomba #2", estado: "En proceso", equipoId: 2, fechaCreacion: "2025-06-10", prioridad: "Alta" },
    { id: "TKT-002", asunto: "Mantenimiento Monitor #1", estado: "Cerrado", equipoId: 1, fechaCreacion: "2025-06-05", fechaCierre: "2025-06-08", prioridad: "Media" },
    { id: "TKT-003", asunto: "Consulta de uso Ventilador", estado: "Abierto", equipoId: 3, fechaCreacion: "2025-06-15", prioridad: "Baja" },
    { id: "TKT-004", asunto: "Bomba #6 con ruido", estado: "Abierto", equipoId: 6, fechaCreacion: "2025-06-14", prioridad: "Media" },
    { id: "TKT-005", asunto: "Monitor #7 no enciende", estado: "Abierto", equipoId: 7, fechaCreacion: "2025-06-16", prioridad: "Alta" },
    { id: "TKT-006", asunto: "Fallo menor Electrocardiógrafo", estado: "Cerrado", equipoId: 4, fechaCreacion: "2025-06-12", fechaCierre: "2025-06-13", prioridad: "Baja" },
  ]);

  // Mantenimientos próximos (simulados)
  const mantenimientosProgramados = [
    { equipo: "Bomba de infusión #2", fecha: "2025-06-12", tipo: "Preventivo", tecnico: "Juan Pérez" },
    { equipo: "Monitor cardíaco #1", fecha: "2025-06-20", tipo: "Calibración", tecnico: "María Gómez" },
    { equipo: "Ventilador #3", fecha: "2025-07-01", tipo: "Preventivo", tecnico: "Juan Pérez" },
  ];

  // Contratos simulados
  const contratos = [
    { id: "CT-00123", producto: "Monitor multiparamétrico", fechaInicio: "2024-06-15", fechaFin: "2025-06-17", valor: 1200, estado: "Vencido" }, // Changed to Vencido for demo
    { id: "CT-00135", producto: "Bomba de infusión", fechaInicio: "2024-07-01", fechaFin: "2025-07-20", valor: 800, estado: "Próximo a Vencer" },
    { id: "CT-00140", producto: "Ventilador", fechaInicio: "2025-01-01", fechaFin: "2026-01-30", valor: 2500, estado: "Vigente" },
    { id: "CT-00145", producto: "Electrocardiógrafo", fechaInicio: "2025-03-01", fechaFin: "2026-03-01", valor: 1500, estado: "Vigente" },
  ];

  // Simulacion de visitas tecnicas por motivo (ultima semana/mes)
  const visitasTecnicasMotivo = [
    { motivo: "Reparación", count: 3 },
    { motivo: "Mantenimiento Preventivo", count: 2 },
    { motivo: "Instalación", count: 1 },
    { motivo: "Revisión General", count: 1 },
  ];

  // Simulacion de evaluaciones del cliente
  const evaluacionesCliente = [
    { calificacion: "Excelente", count: 8 },
    { calificacion: "Bueno", count: 2 },
    { calificacion: "Regular", count: 1 },
    { calificacion: "Malo", count: 0 },
  ];

  // Simulacion de productos disponibles (para la sección de "Oportunidades")
  const productosDisponibles = [
    { id: 1, nombre: "Bomba de Infusión Smart", descripcion: "Modelo avanzado con telemetría.", precio: "$3.500", imagen: "https://via.placeholder.com/150/007bff/FFFFFF?text=Bomba" },
    { id: 2, nombre: "Monitor de Signos Vitales Pro", descripcion: "Monitoreo continuo de 7 parámetros.", precio: "$4.200", imagen: "https://via.placeholder.com/150/28a745/FFFFFF?text=Monitor" },
  ];

  const [notificaciones, setNotificaciones] = useState([
    { id: "inicial-factura", mensaje: "Factura de Mayo disponible", fecha: "2025-05-28" },
  ]);

  // --- Automatic Notifications (from previous code, improved) ---
  useEffect(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const nuevasMantenimientos = mantenimientosProgramados.filter(m => {
      const fechaM = new Date(m.fecha);
      fechaM.setHours(0, 0, 0, 0);
      const diff = (fechaM.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 3 && diff >= 0; // Mantenimiento en los próximos 3 días
    }).map((m, idx) => ({
      id: `mantenimiento-${m.equipo}-${m.fecha}`, // More robust ID
      mensaje: `🛠️ El equipo ${m.equipo} tiene mantenimiento programado para el ${m.fecha} (${Math.ceil((new Date(m.fecha).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))} día(s)).`,
      fecha: m.fecha
    }));

    const nuevasContratos = contratos.filter(c => {
      const fechaF = new Date(c.fechaFin);
      fechaF.setHours(0, 0, 0, 0);
      const diff = (fechaF.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7 && diff >= 0; // Contrato vence en los próximos 7 días
    }).map((c, idx) => ({
      id: `contrato-${c.id}-${c.fechaFin}`, // More robust ID
      mensaje: `📄 Tu contrato ${c.id} del equipo ${c.producto} vence en ${Math.ceil((new Date(c.fechaFin).getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))} día(s).`,
      fecha: c.fechaFin
    }));

    const todas = [...nuevasMantenimientos, ...nuevasContratos];

    if (todas.length > 0) {
      setNotificaciones((prev) => {
        const existentesIds = new Set(prev.map(n => n.id));
        const nuevasFiltradas = todas.filter(n => !existentesIds.has(n.id));
        return [...nuevasFiltradas, ...prev];
      });
    }
  }, [mantenimientosProgramados, contratos]); // Dependencies for useEffect


  // --- KPIs Calculations ---
  const kpiEquiposActivos = equipos.filter(e => e.estado === "Funcionando").length;
  const kpiEquiposPendientesReparacion = equipos.filter(e => e.estado === "En mantenimiento" || e.estado === "Fallando").length;
  const kpiTicketsAbiertos = ticketsSoporte.filter(t => t.estado === "Abierto" || t.estado === "En proceso" || t.estado === "En espera del cliente").length;

  const calculateAvgResolutionTime = () => {
    // Only consider tickets closed in the current filter period (for a real app)
    // For simulation, let's pick some arbitrary values
    switch (filtro) {
      case "semana": return 12; // 12 hours
      case "mes": return 24; // 24 hours
      case "año": return 36; // 36 hours
      case "historico": return 28; // 28 hours
      default: return 24;
    }
  };
  const kpiTiempoPromedioResolucion = calculateAvgResolutionTime();
  const kpiContratosActivos = contratos.filter(c => c.estado === "Vigente" || c.estado === "Próximo a Vencer").length;
  const kpiRenovacionesPendientes = contratos.filter(c => c.estado === "Próximo a Vencer").length;


  // --- Data for Charts ---

  // Data for "Estado de Equipos Arrendados" Pie Chart
  const estadoEquiposData = [
    { nombre: "Funcionando", valor: kpiEquiposActivos },
    { nombre: "En mantenimiento", valor: equipos.filter(e => e.estado === "En mantenimiento").length },
    { nombre: "Fallando", valor: equipos.filter(e => e.estado === "Fallando").length }
  ];

  // Data for "Rendimiento por Tipo de Equipo" Bar Chart (static for now)
  const rendimientoData = [
    { tipo: "Monitores", uso: 80 },
    { tipo: "Bombas", uso: 70 },
    { tipo: "Ventiladores", uso: 60 }
  ];

  // Data for "Estado Actual de Mis Solicitudes de Soporte" Pie Chart
  const estadoTicketsData = [
    { nombre: "Abiertos", valor: ticketsSoporte.filter(t => t.estado === "Abierto").length },
    { nombre: "En Proceso", valor: ticketsSoporte.filter(t => t.estado === "En proceso").length },
    
    { nombre: "Cerrados Recientes", valor: ticketsSoporte.filter(t => t.estado === "Cerrado" && (new Date().getTime() - new Date(t.fechaCierre || '').getTime()) < (30 * 24 * 60 * 60 * 1000)).length }, // Last 30 days
  ].filter(item => item.valor > 0);

  // Simulated data for "Historial de Solicitudes de Soporte" Line Chart
  const generateSoporteHistoryData = (currentFilter: string) => {
    let labels: string[] = [];
    let recibidas: number[] = [];
    let resueltas: number[] = [];

    switch (currentFilter) {
      case "semana":
        labels = ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"];
        recibidas = [1, 0, 2, 1, 0, 0, 1];
        resueltas = [1, 0, 1, 1, 0, 0, 0];
        break;
      case "mes":
        labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
        recibidas = [4, 3, 5, 2];
        resueltas = [3, 3, 4, 2];
        break;
      case "año":
        labels = ["Q1", "Q2", "Q3", "Q4"];
        recibidas = [15, 12, 18, 10];
        resueltas = [14, 11, 16, 9];
        break;
      case "historico":
        labels = ["2023", "2024", "2025"];
        recibidas = [40, 55, 30];
        resueltas = [38, 52, 28];
        break;
      default:
        labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
        recibidas = [4, 3, 5, 2];
        resueltas = [3, 3, 4, 2];
        break;
    }
    return labels.map((label, index) => ({
      name: label,
      recibidas: recibidas[index],
      resueltas: resueltas[index],
    }));
  };
  const soporteHistoryData = generateSoporteHistoryData(filtro);

  // Data for "Estado de Mis Contratos" Pie Chart
  const estadoContratosData = [
    { nombre: "Vigentes", valor: contratos.filter(c => c.estado === "Vigente").length },
    { nombre: "Próximos a Vencer", valor: contratos.filter(c => c.estado === "Próximo a Vencer").length },
    { nombre: "Vencidos", valor: contratos.filter(c => c.estado === "Vencido").length },
  ].filter(item => item.valor > 0);

  // Data for "Mis Evaluaciones de Servicio Recientes" Pie Chart
  const evaluacionesData = evaluacionesCliente.filter(item => item.count > 0);
  const coloresEvaluaciones = ["#28a745", "#007bff", "#ffc107", "#dc3545"]; // Excellent, Good, Regular, Bad

  // PDF Generator (from previous code)
  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Mantenimiento", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Equipo", "Último mantenimiento", "Estado"]],
      body: [
        ["Bomba de infusión", "2025-05-20", "En mantenimiento"],
        ["Monitor cardíaco", "2025-05-15", "Funcionando"],
        ["Ventilador", "2025-05-10", "Funcionando"],
      ]
    });
    doc.save("historial_mantenimiento.pdf");
  };

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Cliente</h1>

      {/* Menu navegación */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link to="/cliente/soporte" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Soporte</Link>
        <Link to="/cliente/EquiposContratados" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Equipos Contratados</Link>
        <Link to="/cliente/historial-visitas" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Historial Visitas</Link>
        <Link to="/cliente/renovacion" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Renovación de contratos</Link>
        <Link to="/cliente/evaluacion" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Evaluación del servicio</Link>
        <Link to="/cliente/contratos" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Mis Contratos</Link>
        <Link to="/cliente/productos" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Productos Disponibles</Link>
        <Link to="/cliente/notificaciones" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">Notificaciones</Link>
      </div>

      {/* Time Filter Buttons for dynamic charts */}
      <div className="flex gap-3 mb-4">
        {["semana", "mes", "año", "historico"].map((f) => (
          <button
            key={f}
            className={`px-4 py-1 rounded border ${
              filtro === f ? "bg-blue-600 text-white border-blue-700 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            } transition-all duration-200`}
            onClick={() => setFiltro(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* KPIs - Detailed for Client */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">⚙️ Equipos Activos</h2>
          <p className="text-4xl font-bold text-green-600">{kpiEquiposActivos}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">🛠️ Equipos En Mantenimiento</h2>
          <p className="text-4xl font-bold text-orange-600">{kpiEquiposPendientesReparacion}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">💬 Tickets Enviados</h2>
          <p className="text-4xl font-bold text-red-600">{kpiTicketsAbiertos}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">⏱️ Prom. Tiempo Res.</h2>
          <p className="text-4xl font-bold text-blue-600">{kpiTiempoPromedioResolucion} hrs</p>
        </div>
      </div>

      {/* Botón de descarga PDF */}
      <div className="text-center md:text-left mt-6">
        <button onClick={descargarPDF} className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
          Descargar Historial de Mantenimiento (PDF)
        </button>
      </div>

      {/* Secciones de Gráficos e Información Detallada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        {/* --- Sección: Mi Servicio de Soporte --- */}
        <div className="md:col-span-2 lg:col-span-3 text-2xl font-bold text-gray-800 mt-4 mb-2">Mi Servicio de Soporte</div>

        {/* Gráfico 1: Estado Actual de Mis Solicitudes de Soporte (Pie Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Estado de Mis Solicitudes de Soporte</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estadoTicketsData}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {estadoTicketsData.map((entry, index) => (
                  <Cell key={`cell-tickets-${index}`} fill={coloresEstadoTickets[index % coloresEstadoTickets.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Historial de Solicitudes de Soporte (Line Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Historial de Solicitudes de Soporte ({filtro[0].toUpperCase() + filtro.slice(1)})</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={soporteHistoryData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="recibidas" stroke="#007bff" activeDot={{ r: 8 }} name="Solicitudes Enviadas" />
              <Line type="monotone" dataKey="resueltas" stroke="#28a745" name="Solicitudes Resueltas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nueva Mini-Tabla: Tickets Recientes */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Mis Últimos Tickets</h2>
          {ticketsSoporte.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200">
                {ticketsSoporte.slice(0, 5).map((ticket) => (
                  <li key={ticket.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ticket.asunto}</p>
                      <p className="text-xs text-gray-500">ID: {ticket.id} - Estado: {ticket.estado}</p>
                    </div>
                    <span className="text-xs text-gray-400">{ticket.fechaCreacion}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center">
                <Link to="/cliente/soporte" className="text-blue-600 hover:underline text-sm">Ver todos mis tickets</Link>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-sm">No tienes tickets recientes.</p>
          )}
        </div>

        {/* --- Sección: Mis Activos y Mantenimiento --- */}
        <div className="md:col-span-2 lg:col-span-3 text-2xl font-bold text-gray-800 mt-8 mb-2">Mis Activos y Mantenimiento</div>

        {/* Gráfico 3: Estado de Equipos Arrendados (Pie Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Estado de Equipos Arrendados</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estadoEquiposData}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {estadoEquiposData.map((entry, index) => (
                  <Cell key={`cell-eq-${index}`} fill={coloresEstadoEquipo[index % coloresEstadoEquipo.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 4: Rendimiento por Tipo de Equipo (Bar Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Rendimiento por Tipo de Equipo</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={rendimientoData}>
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uso" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nuevo Gráfico: Visitas Técnicas Recientes por Motivo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Visitas Técnicas Recientes por Motivo ({filtro[0].toUpperCase() + filtro.slice(1)})</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={visitasTecnicasMotivo}>
              <XAxis dataKey="motivo" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#60a5fa" name="Número de Visitas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nueva Tabla: Próximos Mantenimientos Programados */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Próximos Mantenimientos Programados</h2>
          {mantenimientosProgramados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mantenimientosProgramados.map((m, index) => (
                    <tr key={`maint-prog-${index}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{m.equipo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{m.tipo}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{m.fecha}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{m.tecnico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No hay mantenimientos programados próximos.</p>
          )}
          <div className="mt-4 text-center">
            <Link to="/cliente/historial-visitas" className="text-blue-600 hover:underline text-sm">Ver historial completo de visitas</Link>
          </div>
        </div>

        {/* --- Sección: Mis Contratos y Finanzas --- */}
        <div className="md:col-span-2 lg:col-span-3 text-2xl font-bold text-gray-800 mt-8 mb-2">Mis Contratos y Finanzas</div>

        {/* Nuevo Gráfico: Estado de Mis Contratos (Pie Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Estado de Mis Contratos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estadoContratosData}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {estadoContratosData.map((entry, index) => (
                  <Cell key={`cell-contract-${index}`} fill={coloresEstadoContratos[index % coloresEstadoContratos.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Nueva Mini-Tabla: Contratos Próximos a Vencer */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Contratos Próximos a Vencer</h2>
          {contratos.filter(c => c.estado === "Próximo a Vencer").length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200">
                {contratos.filter(c => c.estado === "Próximo a Vencer").map((contract) => (
                  <li key={contract.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contrato: {contract.id}</p>
                      <p className="text-xs text-gray-500">{contract.producto}</p>
                    </div>
                    <span className="text-xs text-red-500">Vence: {contract.fechaFin}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center">
                <Link to="/cliente/renovacion" className="text-blue-600 hover:underline text-sm">Gestionar Renovaciones</Link>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-sm">No hay contratos próximos a vencer.</p>
          )}
        </div>

        {/* Nuevo Resumen de Facturación */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Mi Última Factura</h2>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">#INV-202505-001</p>
            <p className="text-md text-gray-700">Fecha: 28/05/2025</p>
            <p className="text-2xl font-bold text-green-600 mt-2">$1.850.000 CLP</p>
            <p className="text-sm text-gray-500">Estado: Pagada</p>
            <div className="mt-4">
              <Link to="/cliente/facturas" className="text-blue-600 hover:underline text-sm">Ver todas mis facturas</Link>
            </div>
          </div>
        </div>

        {/* --- Sección: Oportunidades y Feedback --- */}
        <div className="md:col-span-2 lg:col-span-3 text-2xl font-bold text-gray-800 mt-8 mb-2">Oportunidades y Feedback</div>

        {/* Nuevo Gráfico: Mis Evaluaciones de Servicio Recientes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Mis Evaluaciones de Servicio</h2>
          {evaluacionesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={evaluacionesData}
                  dataKey="count"
                  nameKey="calificacion"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {evaluacionesData.map((entry, index) => (
                    <Cell key={`cell-eval-${index}`} fill={coloresEvaluaciones[index % coloresEvaluaciones.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-sm">Aún no has enviado evaluaciones de servicio.</p>
          )}
          <div className="mt-4 text-center">
            <Link to="/cliente/evaluacion" className="text-blue-600 hover:underline text-sm">Evaluar Servicio</Link>
          </div>
        </div>

        {/* Nueva Sección: Productos y Servicios Recomendados/Disponibles */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Productos y Servicios Disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productosDisponibles.map(p => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-3 text-center">
                <img src={p.imagen} alt={p.nombre} className="mx-auto w-24 h-24 object-contain mb-2" />
                <h3 className="font-semibold text-gray-900">{p.nombre}</h3>
                <p className="text-sm text-gray-600">{p.descripcion}</p>
                <p className="text-lg font-bold text-blue-700 mt-1">{p.precio}</p>
                <button className="mt-2 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600">Ver Detalles</button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/cliente/productos" className="text-blue-600 hover:underline text-sm">Explorar todos los productos</Link>
          </div>
        </div>

      </div> {/* End of Charts & Info Grid */}

      {/* Notificaciones (at the bottom, but easily visible) */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Últimas Notificaciones</h2>
        <ul className="space-y-2">
          {notificaciones.length > 0 ? (
            notificaciones.map((n) => (
              <li key={n.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{n.mensaje}</span>
                  {n.fecha && <span className="text-sm text-gray-500">{n.fecha}</span>}
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No hay notificaciones recientes.</p>
          )}
        </ul>
      </div>
    </div>
  );
}