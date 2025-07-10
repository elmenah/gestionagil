import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
    const { role } = useContext(AuthContext);

    const menu: Record<string, [string, string][]> = {
        Cliente: [['/cliente/dashboard', 'Dashboard']],
        Tecnico: [['/tecnico/dashboard', 'Dashboard']],
        Admin: [['/admin/dashboard', 'Dashboard']]
    };

    return (
        <div className="w-64 bg-white border-r p-4 space-y-2">
            <h2 className="font-bold mb-4">{role} Panel</h2>
            {menu[role]?.map(([path, label]) => (
                <Link key={path} to={path} className="block py-2 px-3 rounded hover:bg-gray-200">
                    {label}
                </Link>
            ))}
        </div>
    );
}
