import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { role, setRole } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setRole('');
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b p-4 flex justify-between items-center">
            <span className="font-semibold">PrestaMed - {role}</span>
            <div className="space-x-4">
                <button onClick={() => navigate(`/${role.toLowerCase()}/dashboard`)} className="bg-blue-500 text-white px-3 py-1 rounded">Volver al Dashboard</button>
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Cerrar sesión</button>
            </div>
        </nav>
    );
}
