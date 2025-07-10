import { createContext, useState } from 'react';

interface AuthContextType {
    role: string;
    setRole: (role: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    role: '',
    setRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [role, setRole] = useState<string>('');

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};
