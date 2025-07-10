import { useMemo } from "react";

interface Contrato {
  numero: string;
  producto: string;
  fechaFin: string;
}

interface ProductoArrendado {
  nombre: string;
  fechaVencimiento: string;
}

// Contratos que vencen
const contratos: Contrato[] = [
  { numero: "CT-00123", producto: "Monitor multiparamétrico", fechaFin: "2025-06-15" },
  { numero: "CT-00127", producto: "Ventilador mecánico", fechaFin: "2025-06-12" },
  { numero: "CT-00135", producto: "Bomba de infusión", fechaFin: "2025-06-20" },
];

// Equipos arrendados con vencimiento
const productos: ProductoArrendado[] = [
  { nombre: "Monitor multiparamétrico", fechaVencimiento: "2025-06-14" },
  { nombre: "Ventilador mecánico", fechaVencimiento: "2025-06-10" },
  { nombre: "Bomba de infusión", fechaVencimiento: "2025-06-21" },
];

export default function HU14_Notificaciones() {
  const hoy = new Date();

  const notificaciones = useMemo(() => {
    const notiContratos = contratos.map((c) => {
      const fechaFin = new Date(c.fechaFin);
      const dias = Math.ceil((fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      return dias >= 0 && dias <= 7
        ? `📄 Tu contrato ${c.numero} del producto ${c.producto} vence en ${dias} día${dias > 1 ? "s" : ""} (${c.fechaFin}).`
        : null;
    });

    const notiProductos = productos.map((p) => {
      const fecha = new Date(p.fechaVencimiento);
      const dias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      return dias >= 0 && dias <= 7
        ? `🔧 El equipo arrendado ${p.nombre} vence en ${dias} día${dias > 1 ? "s" : ""} (${p.fechaVencimiento}).`
        : null;
    });

    return [...notiContratos, ...notiProductos].filter(Boolean) as string[];
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notificaciones de Vencimiento</h1>

     

      {notificaciones.length === 0 ? (
        <p className="text-gray-500">🎉 No tienes vencimientos próximos en tus contratos ni productos.</p>
      ) : (
        <ul className="space-y-3">
          {notificaciones.map((mensaje, i) => (
            <li key={i} className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow">
              {mensaje}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
