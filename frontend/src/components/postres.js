import React from 'react';
import PlatillosComponent from './PlatillosComponent';
import seccionesMap from './seccionesMap';

function Postres({ platillos }) {
  const platillosDeEntradas = platillos.filter(platillo => platillo.seccion_id === seccionesMap.postres);
  
  return (
    <div>
      <PlatillosComponent platillos={platillosDeEntradas} />
      {/* Puedes agregar contenido adicional si lo necesitas */}
    </div>
  );
}

export default Postres;
