import React, { createContext, useContext, useState } from "react";

type UserContextType = {
    matricula: string | null;
    setMatricula: (matricula: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [matricula, setMatricula] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ matricula, setMatricula }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser debe usarse dentro de <UserProvider />");
    return context;
};
