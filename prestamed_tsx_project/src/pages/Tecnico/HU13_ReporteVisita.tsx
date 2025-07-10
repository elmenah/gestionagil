import { useState } from "react";

interface Visita {
    id: number;
    cliente: string;
    fecha: string;
}

interface ArchivoAdjunto {
    id: number;
    nombre: string;
    tipo: "Documento" | "Imagen";
    url: string;
}

interface Equipo {
    id: number;
    nombre: string;
    estado: "Operativo" | "En mantenimiento" | "Retirado";
    visitaId: number;
}

export default function HU13_ReporteVisita() {
    const [visitas] = useState<Visita[]>([
        { id: 1, cliente: "Clínica San Pedro", fecha: "2025-06-05" },
        { id: 2, cliente: "Hospital Central", fecha: "2025-06-02" },
    ]);

    const [equipos, setEquipos] = useState<Equipo[]>([
        { id: 1, nombre: "Monitor", estado: "Operativo", visitaId: 1 },
        { id: 2, nombre: "Bomba Infusión", estado: "En mantenimiento", visitaId: 1 },
        { id: 3, nombre: "Ventilador", estado: "Operativo", visitaId: 2 },
    ]);

    const [visitaSeleccionada, setVisitaSeleccionada] = useState<number | "">("");
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<number | "">("");
    const [nuevoEstado, setNuevoEstado] = useState<Equipo["estado"]>("Operativo");

    const [observaciones, setObservaciones] = useState("");
    const [conclusiones, setConclusiones] = useState("");

    const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [tipoArchivo, setTipoArchivo] = useState<"Documento" | "Imagen">("Documento");

    const handleAdjuntarArchivo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileInput) return;

        // Validar tipo y tamaño
        const sizeMB = fileInput.size / (1024 * 1024);
        if (sizeMB > 5) {
            alert("Archivo demasiado grande (máx. 5MB)");
            return;
        }

        const url = URL.createObjectURL(fileInput);
        const nuevoArchivo: ArchivoAdjunto = {
            id: archivos.length + 1,
            nombre: fileInput.name,
            tipo: tipoArchivo,
            url,
        };

        setArchivos([nuevoArchivo, ...archivos]);
        setFileInput(null);
    };

    const handleSubmitReporte = (e: React.FormEvent) => {
        e.preventDefault();

        if (!visitaSeleccionada || !equipoSeleccionado) {
            alert("Seleccione una visita y un equipo.");
            return;
        }

        // Simular actualización de estado
        setEquipos(prev =>
            prev.map(eq =>
                eq.id === equipoSeleccionado ? { ...eq, estado: nuevoEstado } : eq
            )
        );

        alert("Reporte enviado y estado actualizado ✅");

        // Reset
        setVisitaSeleccionada("");
        setEquipoSeleccionado("");
        setNuevoEstado("Operativo");
        setObservaciones("");
        setConclusiones("");
        setArchivos([]);
    };

    const equiposFiltrados = equipos.filter(eq => eq.visitaId === visitaSeleccionada);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reporte de Visita</h1>

            <form onSubmit={handleSubmitReporte} className="space-y-6 bg-white rounded shadow p-6">

                {/* Selección de visita */}
                <div>
                    <label className="block mb-1 font-medium">Visita realizada</label>
                    <select
                        value={visitaSeleccionada}
                        onChange={(e) => {
                            const value = e.target.value;
                            setVisitaSeleccionada(value ? Number(value) : "");
                            setEquipoSeleccionado("");
                        }}
                        className="w-full border px-3 py-2 rounded"
                        required
                    >
                        <option value="">-- Seleccionar visita --</option>
                        {visitas.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.cliente} - {v.fecha}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selección de equipo */}
                {visitaSeleccionada && (
                    <>
                        <div>
                            <label className="block mb-1 font-medium">Equipo intervenido</label>
                            <select
                                value={equipoSeleccionado}
                                onChange={(e) => setEquipoSeleccionado(Number(e.target.value))}
                                className="w-full border px-3 py-2 rounded"
                                required
                            >
                                <option value="">-- Seleccionar equipo --</option>
                                {equiposFiltrados.map((eq) => (
                                    <option key={eq.id} value={eq.id}>
                                        {eq.nombre} (Estado actual: {eq.estado})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estado nuevo */}
                        <div>
                            <label className="block mb-1 font-medium">Nuevo estado</label>
                            <select
                                value={nuevoEstado}
                                onChange={(e) =>
                                    setNuevoEstado(e.target.value as Equipo["estado"])
                                }
                                className="w-full border px-3 py-2 rounded"
                                required
                            >
                                <option value="Operativo">Operativo</option>
                                <option value="En mantenimiento">En mantenimiento</option>
                                <option value="Retirado">Retirado</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Observaciones */}
                <div>
                    <label className="block mb-1 font-medium">Observaciones</label>
                    <textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        rows={3}
                        required
                    ></textarea>
                </div>

                {/* Conclusiones */}
                <div>
                    <label className="block mb-1 font-medium">Conclusiones</label>
                    <textarea
                        value={conclusiones}
                        onChange={(e) => setConclusiones(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        rows={3}
                        required
                    ></textarea>
                </div>

                {/* Adjuntar archivo */}
                <div className="space-y-2">
                    <label className="block mb-1 font-medium">Adjuntar archivo</label>
                    <div className="flex items-center space-x-4 mb-2">
                        <select
                            value={tipoArchivo}
                            onChange={(e) =>
                                setTipoArchivo(e.target.value as "Documento" | "Imagen")
                            }
                            className="border px-3 py-2 rounded"
                        >
                            <option value="Documento">Documento</option>
                            <option value="Imagen">Imagen</option>
                        </select>

                        <input
                            type="file"
                            accept={tipoArchivo === "Imagen" ? "image/*" : ".pdf,.doc,.docx"}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setFileInput(e.target.files[0]);
                                }
                            }}
                            className="border px-3 py-2 rounded"
                        />

                        <button
                            onClick={handleAdjuntarArchivo}
                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                            type="button"
                        >
                            Adjuntar
                        </button>
                    </div>

                    {/* Archivos adjuntos */}
                    {archivos.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Archivos adjuntos:</h3>
                            <ul className="space-y-1">
                                {archivos.map((archivo) => (
                                    <li
                                        key={archivo.id}
                                        className="flex justify-between items-center border rounded px-3 py-2"
                                    >
                                        <div>
                                            <span className="font-medium">{archivo.nombre}</span> (
                                            {archivo.tipo})
                                        </div>
                                        {archivo.tipo === "Imagen" && (
                                            <img
                                                src={archivo.url}
                                                alt={archivo.nombre}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Enviar */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Enviar reporte
                </button>
            </form>
        </div>
    );
}
