import React from 'react';
import './PlatillosComponent.css';

function PlatillosComponent({ platillos }) {
  return (
    <ul>
      {platillos && platillos.length > 0 ? (
        platillos.map(platillo => (
          <li key={platillo.id}>
            {platillo.imagen ? (
              <img src={`http://localhost:5001/${platillo.imagen}`} alt={platillo.nombre} />
            ) : (
              <div className="no-image"></div>
            )}
            <div className="platillo-details">
              <span className="platillo-name">{platillo.nombre}</span>
              <span className="platillo-price">${platillo.precio}</span>
            </div>
          </li>
        ))
      ) : (
        <li>No hay platillos disponibles</li>
      )}
    </ul>
  );
}

export default PlatillosComponent;



