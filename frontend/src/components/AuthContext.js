import React, { createContext, useState, useContext,  useEffect} from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const isLoggedIn = Boolean(currentUser);

    const login = (token) => {
        // Simplemente por ahora estamos usando este chequeo básico
        if (token) {
            setCurrentUser({ token });
            console.log("Usuario actualizado:", currentUser);  // Añade esta línea
        }
    };

    useEffect(() => {
        console.log("Usuario actualizado:", currentUser);
    }, [currentUser]);

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};



