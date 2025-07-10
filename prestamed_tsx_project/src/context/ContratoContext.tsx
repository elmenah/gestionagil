import { createContext, useContext, useState, ReactNode } from "react";

interface Contrato {
  id: number;
  numero: string;
  producto: string;
  fechaInicio: string;
  fechaFin: string;
  estado: "Activo" | "Finalizado";
  firmado: boolean;
  fechaFirma?: string;
  email: string; // Nuevo campo para correo del cliente
}

interface ContratoContextProps {
  contratos: Contrato[];
  agregarContrato: (producto: string) => Contrato;
  firmarContrato: (id: number) => void;
}

const ContratoContext = createContext<ContratoContextProps | null>(null);

// ✅ Hook declarado primero, no exportado directamente
const useContrato = () => {
  const context = useContext(ContratoContext);
  if (!context) throw new Error("ContratoContext debe usarse dentro del proveedor");
  return context;
};

// ✅ Proveedor declarado aquí también sin export directo
const ContratoProvider = ({ children }: { children: ReactNode }) => {
  const [contratos, setContratos] = useState<Contrato[]>(
    [
      {
        id: 1,
        numero: "CT-00123",
        producto: "Bomba de infusión",
        fechaInicio: "2024-06-01",
        fechaFin: "2025-06-01",
        estado: "Activo",
        firmado: false,
        email: "menanicolas161@gmail.com",
      },
      {
        id: 2,
        numero: "CT-00124",
        producto: "Monitor multiparamétrico",
        fechaInicio: "2024-07-01",
        fechaFin: "2025-07-01",
        estado: "Finalizado",
        firmado: true,
        fechaFirma: "2025-07-01",
        email: "menanicolas161@gmail.com",
      },
    ]
  );

  const agregarContrato = (producto: string): Contrato => {
    const nuevo: Contrato = {
      id: contratos.length + 1,
      numero: `CT-00${Math.floor(100 + Math.random() * 900)}`,
      producto,
      fechaInicio: new Date().toISOString().split("T")[0],
      fechaFin: "2026-06-01",
      estado: "Activo",
      firmado: false,
      email: "menanicolas161@gmail.com",
    };
    setContratos([nuevo, ...contratos]);
    return nuevo;
  };

  const firmarContrato = (id: number) => {
    setContratos(prev =>
      prev.map(c =>
        c.id === id ? { ...c, firmado: true, fechaFirma: new Date().toLocaleString() } : c
      )
    );
  };

  return (
    <ContratoContext.Provider value={{ contratos, agregarContrato, firmarContrato }}>
      {children}
    </ContratoContext.Provider>
  );
};

// ✅ Exportaciones agrupadas al final
export { useContrato, ContratoProvider };
