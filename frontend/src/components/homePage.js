import React from 'react';
import './homePage.css';
import seccionesMap from './seccionesMap'; 
import { Link } from 'react-router-dom';
import logo from './Navbar/logo.png'; // Importa la imagen

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function HomePage({ activeSection }) {
    return (
        <div className="homepage">
            <img src={logo} alt="Logo del Restaurante" />
            <h2>MENU</h2>
            {Object.keys(seccionesMap).map(seccion => (
                <div key={seccion}>
                    <Link 
                        to={`/${seccion}`} 
                        className={seccion === activeSection ? 'active' : ''} // Aquí usamos activeSection para añadir la clase
                    >
                        {capitalizeFirstLetter(seccion)}
                    </Link>
                </div>
            ))}
            <h2>HORARIOS</h2>
            <p>Mondays to Thursdays • 13 PM to 11 PM</p> 
            <p>Fridays to Sundays • 13 PM to 1 AM</p>
            <h2>SIGUENOS EN</h2>
            <p>@ADICTOSALSUSHI_</p>
        </div>
    );
}


export default HomePage;


