import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { setRole } = useContext(AuthContext);
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const usuariosFake = [
        { correo: "cliente@prestamed.cl", password: "cliente123", rol: "cliente" },
        { correo: "tecnico@prestamed.cl", password: "tecnico123", rol: "tecnico" },
        { correo: "admin@prestamed.cl", password: "admin123", rol: "admin" },
    ];

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const user = usuariosFake.find(
            (u) => u.correo === correo && u.password === password
        );

        if (user) {
            // Login exitoso
            setRole(user.rol);
            navigate(`/${user.rol}/dashboard`);
        } else {
            // Error
            setError("Credenciales incorrectas.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Correo</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Iniciar sesión
                    </button>
                </form>

                {/* 👉 Tip de prueba */}
                <div className="mt-6 text-sm text-gray-500">
                    <p><strong>Usuarios de prueba:</strong></p>
                    <p>cliente@prestamed.cl / cliente123</p>
                    <p>tecnico@prestamed.cl / tecnico123</p>
                    <p>admin@prestamed.cl / admin123</p>
                </div>
            </div>
        </div>
    );
}
