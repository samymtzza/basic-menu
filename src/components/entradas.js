import React from 'react';
import PlatillosComponent from './PlatillosComponent';
import seccionesMap from './seccionesMap';

function Entradas({ platillos }) {
  const platillosDeEntradas = platillos.filter(platillo => platillo.seccion_id === seccionesMap.entradas);
  
  return (
    <div>
      <PlatillosComponent platillos={platillosDeEntradas} />
      {/* Puedes agregar contenido adicional si lo necesitas */}
    </div>
  );
}


export default Entradas;
