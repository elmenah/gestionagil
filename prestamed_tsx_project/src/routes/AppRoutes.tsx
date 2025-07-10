import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';

// Cliente
import HU02_Dashboard from '../pages/Cliente/HU02_Dashboard';
import HU05_Soporte from '../pages/Cliente/HU05_Soporte';
import HU07_Renovacion from '../pages/Cliente/HU07_Renovacion';
import HU08_Evaluacion from '../pages/Cliente/HU08_Evaluacion';
import HU09_Contratos from '../pages/Cliente/HU09_Contratos';
import HU10_Productos from '../pages/Cliente/HU10_Productos';
import HU14_Notificaciones from '../pages/Cliente/HU14_Notificaciones';
import HU11_HistorialVisitasCliente from "../pages/Cliente/HU11_HistorialVisitasCliente";
import EquiposContratados from '../pages/Cliente/EquiposContratados';


// Tecnico
import HU01_Dashboard from '../pages/Tecnico/HU01_Dashboard';
import HU03_CalendarioVisitas from '../pages/Tecnico/HU03_CalendarioVisitas';
import HU04_HistorialTecnico from '../pages/Tecnico/HU04_HistorialTecnico';
import HU06_Inventario_Tecnico from '../pages/Tecnico/HU06_Inventario';
import HU13_ReporteVisita from '../pages/Tecnico/HU13_ReporteVisita';
import HU16_AdjuntarImagenes from '../pages/Tecnico/HU13_ReporteVisita';

// Admin
import DashboardAdmin from '../pages/Admin/dashboard';
import AdminHistorialVisitas from '../pages/Admin/AdminHistorialVisitas';
import HU15_FacturasPostServicio from '../pages/Admin/FacturasAuto';
import GestionClientes from '../pages/Admin/GestionClientes';

export default function AppRoutes() {
    const { role } = useContext(AuthContext);

    if (!role) {
        return (
            <Routes>
                <Route path="*" element={<Login />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to={`/${role.toLowerCase()}/dashboard`} />} />
            <Route path="/login" element={<Login />} />

            {/* Cliente */}
            <Route path="/cliente/dashboard" element={<Layout><HU02_Dashboard /></Layout>} />
            <Route path="/cliente/soporte" element={<Layout><HU05_Soporte /></Layout>} />
            <Route path="/cliente/renovacion" element={<Layout><HU07_Renovacion /></Layout>} />
            <Route path="/cliente/evaluacion" element={<Layout><HU08_Evaluacion /></Layout>} />
            <Route path="/cliente/contratos" element={<Layout><HU09_Contratos /></Layout>} />
            <Route path="/cliente/productos" element={<Layout><HU10_Productos /></Layout>} />
            <Route path="/cliente/historial-visitas" element={<Layout><HU11_HistorialVisitasCliente /> </Layout>} />
            <Route path="/cliente/notificaciones" element={<Layout><HU14_Notificaciones /></Layout>} />
            <Route path="/cliente/EquiposContratados" element={<Layout><EquiposContratados /></Layout>} />

            {/* Tecnico */}
            <Route path="/tecnico/dashboard" element={<Layout><HU01_Dashboard /></Layout>} />
            <Route path="/tecnico/calendario-visitas" element={<Layout><HU03_CalendarioVisitas /></Layout>} />
            <Route path="/tecnico/historial-tecnico" element={<Layout><HU04_HistorialTecnico /></Layout>} />
            <Route path="/tecnico/inventario" element={<Layout><HU06_Inventario_Tecnico /></Layout>} />
            <Route path="/tecnico/reporte-visita" element={<Layout><HU13_ReporteVisita /></Layout>} />
            

            {/* Admin */}
            <Route path="/admin/dashboard" element={<Layout><DashboardAdmin/></Layout>} />
            <Route path="/admin/HistorialVisitas" element={<Layout><AdminHistorialVisitas/></Layout>} />
            <Route path="/admin/FacturasAuto" element={<Layout><HU15_FacturasPostServicio/></Layout>} />
            <Route path="/admin/GestionUsuarios" element={<Layout><GestionClientes/></Layout>} />
            
        </Routes>
    );
}
