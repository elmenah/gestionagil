import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { role } = useContext(AuthContext);
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
