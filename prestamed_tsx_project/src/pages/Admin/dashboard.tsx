import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from "react";
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function HU01_Dashboard_Admin() {
  const [filtro, setFiltro] = useState("mes"); // Default filter is 'mes'

  // --- Simulated Data for different time filters ---
  // --- This data will now also drive the KPIs ---

  const getKPIsData = (currentFilter: string) => {
    let equiposArrendadosCurrent: number;
    let equiposArrendadosDesired: number;
    let equiposArrendadosTrend: string;

    let visitasTecnicasCurrent: number;
    let visitasTecnicasDesired: number; // Lower is better for this KPI

    let tiempoPromAtencionCurrent: number;
    let tiempoPromAtencionDesired: number; // Lower is better for this KPI

    let clientesAsociadosCurrent: number;
    let clientesAsociadosDesired: number;

    switch (currentFilter) {
      case "semana":
        equiposArrendadosCurrent = 40;
        equiposArrendadosDesired = 50;
        equiposArrendadosTrend = "▲ 5% más que la semana anterior";
        visitasTecnicasCurrent = 10; // Lower is better
        visitasTecnicasDesired = 7;
        tiempoPromAtencionCurrent = 2; // Lower is better
        tiempoPromAtencionDesired = 1.5;
        clientesAsociadosCurrent = 3;
        clientesAsociadosDesired = 5;
        break;
      case "mes":
        equiposArrendadosCurrent = 240;
        equiposArrendadosDesired = 270;
        equiposArrendadosTrend = "▲ 20% más que el mes anterior";
        visitasTecnicasCurrent = 44; // Lower is better
        visitasTecnicasDesired = 30;
        tiempoPromAtencionCurrent = 15; // Lower is better
        tiempoPromAtencionDesired = 12;
        clientesAsociadosCurrent = 312;
        clientesAsociadosDesired = 350;
        break;
      case "año":
        equiposArrendadosCurrent = 2200;
        equiposArrendadosDesired = 2500;
        equiposArrendadosTrend = "▲ 15% más que el año anterior";
        visitasTecnicasCurrent = 500; // Lower is better
        visitasTecnicasDesired = 400;
        tiempoPromAtencionCurrent = 14; // Lower is better
        tiempoPromAtencionDesired = 11;
        clientesAsociadosCurrent = 1200;
        clientesAsociadosDesired = 1350;
        break;
      case "anteriores": // Represents a historical overview, e.g., cumulative over several years
        equiposArrendadosCurrent = 5000;
        equiposArrendadosDesired = 5500;
        equiposArrendadosTrend = "▲ Histórico";
        visitasTecnicasCurrent = 1000; // Lower is better
        visitasTecnicasDesired = 800;
        tiempoPromAtencionCurrent = 13; // Lower is better
        tiempoPromAtencionDesired = 10;
        clientesAsociadosCurrent = 1500;
        clientesAsociadosDesired = 1700;
        break;
      default: // 'mes' is default
        equiposArrendadosCurrent = 240;
        equiposArrendadosDesired = 270;
        equiposArrendadosTrend = "▲ 20% más que el mes anterior";
        visitasTecnicasCurrent = 44; // Lower is better
        visitasTecnicasDesired = 30;
        tiempoPromAtencionCurrent = 15; // Lower is better
        tiempoPromAtencionDesired = 12;
        clientesAsociadosCurrent = 312;
        clientesAsociadosDesired = 350;
        break;
    }

    return [
      {
        title: "📈 Equipos Arrendados",
        current: equiposArrendadosCurrent,
        desired: equiposArrendadosDesired,
        unit: "",
        trend: equiposArrendadosTrend,
        color: "green-600",
        type: "higher_is_better"
      },
      {
        title: "Visitas Tecnicas realizadas",
        current: visitasTecnicasCurrent,
        desired: visitasTecnicasDesired,
        unit: "",
        trend: "",
        color: "red-600",
        type: "lower_is_better"
      },
      {
        title: "⏱️ Tiempo prom. atención",
        current: tiempoPromAtencionCurrent,
        desired: tiempoPromAtencionDesired,
        unit: " hrs",
        trend: "",
        color: "yellow-600",
        type: "lower_is_better"
      },
      {
        title: "Clientes Asociados",
        current: clientesAsociadosCurrent,
        desired: clientesAsociadosDesired,
        unit: "",
        trend: "",
        color: "purple-600",
        type: "higher_is_better"
      },
    ];
  };

  const currentKPIs = getKPIsData(filtro);


  const generateArriendosData = (currentFilter: string) => {
    let labels: string[] = [];
    let actualData: number[] = [];
    let desiredData: number[] = [];

    switch (currentFilter) {
      case "semana":
        labels = ["Lunes", "Martes", "Miérc", "Jueves", "Viernes", "Sáb", "Dom"];
        actualData = [5, 7, 6, 8, 9, 4, 2]; // Simulated weekly rentals
        desiredData = [7, 8, 8, 9, 10, 5, 3]; // Simulated weekly desired rentals
        break;
      case "mes":
        labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
        actualData = [90, 110, 130, 150, 170, 240];
        desiredData = [130, 150, 170, 200, 230, 270];
        break;
      case "año":
        labels = ["2022", "2023", "2024", "2025"];
        actualData = [1100, 1500, 1800, 2000]; // Simulated yearly rentals (1400 for current year mid-way)
        desiredData = [1600, 2000, 2500, 2800]; // Simulated yearly desired rentals
        break;
      case "anteriores": // Example for historical data (could be last 5 years, etc.)
        labels = ["2020", "2021", "2022", "2023", "2024"];
        actualData = [1000, 1200, 1500, 1800, 2200];
        desiredData = [1100, 1300, 1600, 2000, 2500];
        break;
      default: // 'mes' is default
        labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
        actualData = [90, 110, 130, 150, 170, 240];
        desiredData = [130, 150, 170, 200, 230, 270];
        break;
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Actual",
          data: actualData,
          backgroundColor: "#36A2EB",
        },
        {
          label: "Deseado",
          data: desiredData,
          backgroundColor: "#FFCE56",
        },
      ],
    };
  };

  const generatePrestacionesData = (currentFilter: string) => {
    let labels: string[] = [];
    let actualData: number[] = [];
    let desiredData: number[] = [];

    switch (currentFilter) {
      case "semana":
        labels = ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"];
        actualData = [15, 12, 10, 18, 14, 8, 5]; 
        desiredData = [12, 10, 8, 15, 12, 6, 4]; 
        break;
      case "mes":
        labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
        actualData = [65, 60, 58, 55];
        desiredData = [60, 52, 50, 44]; 
        break;
      case "año":
        labels = ["Q1", "Q2", "Q3", "Q4"]; 
        actualData = [250, 280, 220, 300]; 
        desiredData = [200, 230, 180, 250]; 
        break;
      case "anteriores": 
        labels = ["2022", "2023", "2024"];
        actualData = [800, 950, 1100];
        desiredData = [700, 850, 1000]; 
        break;
      default: 
        labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
        actualData = [65, 60, 58, 55];
        desiredData = [60, 52, 50, 44];
        break;
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Actual",
          data: actualData,
          borderColor: "#4BC0C0",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
        },
        {
          label: "Deseado",
          data: desiredData,
          borderColor: "#FF6384",
          borderDash: [5, 5],
          fill: false,
        },
      ],
    };
  };

  
  const currentArriendosData = generateArriendosData(filtro);
  const currentPrestacionesData = generatePrestacionesData(filtro);


  
  const tipoEmpresaData = {
    labels: ["Clínica", "Centro Médico", "Hospital"],
    datasets: [
      {
        data: [18, 22, 60],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const tiempoData = {
    labels: ["Mañana", "Tarde", "Noche"],
    datasets: [
      {
        label: "Tiempo de Atención",
        data: [30, 45, 25],
        backgroundColor: ["#8e44ad", "#3498db", "#f1c40f"],
      },
    ],
  };

  const clientes = [
    { nombre: "Clínica HCVM", cantidad: 120, objetivo: 150 },
    { nombre: "CentroMed", cantidad: 96, objetivo: 110 },
    { nombre: "Red Salud", cantidad: 58, objetivo: 70 },
    { nombre: "Integra MedTec", cantidad: 38, objetivo: 45 },
  ];


  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
    
      {/* 🔹 Quick Access Buttons (Top Navigation) */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link to="/admin/HistorialVisitas" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
          Historial De Visitas
        </Link>
        <Link to="/admin/FacturasAuto" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
          Ver Facturas Generadas
        </Link>
        <Link to="/admin/GestionUsuarios" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200">
          Gestion Usuarios
        </Link>
      </div>

      {/* 🔹 Time Filter Buttons for Charts and KPIs */}
      <div className="flex gap-3 mb-4">
        {["semana", "mes", "año", "2024"].map((f) => (
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

      {/* 🔹 KPIs - Displaying Current vs. Desired */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {currentKPIs.map((kpi, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow-md">
            <h2 className="text-md font-medium text-gray-700">{kpi.title}</h2>
            <p className={`text-2xl font-bold text-${kpi.color} mt-1`}>
              {kpi.current} {kpi.unit}
            </p>
            <p className="text-sm text-gray-500">
              Objetivo: {kpi.desired} {kpi.unit}
            </p>
            {kpi.trend && <p className={`text-sm text-${kpi.color}`}>{kpi.trend}</p>}
            {/* Conditional progress display based on KPI type (higher better vs. lower better) */}
            {kpi.desired > 0 && (
              <p className="text-sm mt-1">
                Progreso:{" "}
                <span
                  className={
                    kpi.type === "lower_is_better"
                      ? kpi.current <= kpi.desired 
                        ? "text-green-500"
                        : "text-red-500" 
                      : kpi.current >= kpi.desired 
                      ? "text-green-500"
                      : "text-orange-500" 
                  }
                >
                  {kpi.type === "lower_is_better"
                    ? `${(kpi.desired / kpi.current * 100).toFixed(0)}% del objetivo` 
                    : `${(kpi.current / kpi.desired * 100).toFixed(0)}%`
                  }
                  {kpi.type === "lower_is_better" && " (cuanto más bajo, mejor)"}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 🔹 Charts - Dynamically updated by filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-3 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Evolución de Equipos Arrendados ({filtro[0].toUpperCase() + filtro.slice(1)})</h2>
          <Bar data={currentArriendosData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Visitas Técnicas realizadas ({filtro[0].toUpperCase() + filtro.slice(1)})</h2>
          <Line data={currentPrestacionesData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md w-auto">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Tipos de Empresa</h2>
          <Doughnut data={tipoEmpresaData} />
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Distribución Tiempo Atención</h2>
          <Pie data={tiempoData} />
        </div>
      </div>

      
    </div>
  );
}