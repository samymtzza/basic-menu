import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import HomePage from './components/homePage';
import Navbar from './components/Navbar/navbar';
import PlatillosComponent from './components/PlatillosComponent';
import Bebidas from './components/bebidas';
import Entradas from './components/entradas';
import Alimentos from './components/alimentos';
import Postres from './components/postres';
import Asistencia from './components/asistencia';

import seccionesMap from './components/seccionesMap';  // Importa seccionesMap

import { AuthProvider, useAuth } from './components/AuthContext';
import Login from './components/Login';
import Admin from './components/Admin';

function AppContent() {
    const { isLoggedIn } = useAuth();
    const [platillos, setPlatillos] = useState([]);
    const location = useLocation();
    const seccionActual = location.pathname.slice(1); // Esto eliminará la barra inicial '/'
    const showNavbar = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/admin';

    useEffect(() => {
        if (seccionActual) {
            axios.get(`http://localhost:5001/platillos?seccion=${seccionActual}`)
                .then(response => {
                    setPlatillos(response.data);
                })
                .catch(error => {
                    console.error("Hubo un error al obtener los platillos:", error);
                });
        }
    }, [seccionActual]);

    const componentsMap = {
        bebidas: Bebidas,
        entradas: Entradas,
        alimentos: Alimentos,
        postres: Postres,
        asistencia: Asistencia,
    };
    

    return (
        <div className="App">
            {showNavbar && <Navbar activeSection={seccionActual} />}
            <Routes>
            <Route exact path="/" element={<HomePage />} />
                {Object.keys(seccionesMap).map(seccion => (
                    <Route key={seccion} path={`/${seccion}`} element={React.createElement(componentsMap[seccion], { platillos })} />
                ))}

                <Route path="/platillos" element={<PlatillosComponent platillos={platillos} />} />
                <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/admin" replace />} />
                <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<h2>Página no encontrada</h2>} />
            </Routes>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}










