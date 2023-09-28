import React from 'react';
import PlatillosComponent from './PlatillosComponent';
import seccionesMap from './seccionesMap';

function Bebidas({ platillos }) {
  const platillosDeEntradas = platillos.filter(platillo => platillo.seccion_id === seccionesMap.bebidas);
  
  return (
    <div>
      <PlatillosComponent platillos={platillosDeEntradas} />
      {/* Puedes agregar contenido adicional si lo necesitas */}
    </div>
  );
}

export default Bebidas;


