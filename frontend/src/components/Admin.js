import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [platillos, setPlatillos] = useState([]);
  const [secciones, setSecciones] = useState([]); // Nuevo estado para las secciones
  const [selectedSeccion, setSelectedSeccion] = useState(""); // Sección seleccionada
  const [modalState, setModalState] = useState({ type: null, platillo: null });
  const [selectedPlatillo, setSelectedPlatillo] = useState(null);
  
  // Obtener las secciones desde el backend
  const fetchSecciones = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5001/secciones", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setSecciones(response.data);
    } catch (error) {
      console.error("Error al recuperar las secciones:", error);
      alert("Error al recuperar las secciones. Por favor, inténtalo de nuevo.");
    }
  }, []);

  // Cargando secciones cuando se monta el componente
  useEffect(() => {
    fetchSecciones();
  }, [fetchSecciones]);

  const fetchPlatillos = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5001/platillos", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setPlatillos(response.data);
    } catch (error) {
      console.error("Error al recuperar los platillos:", error);
      if (error.response && error.response.status === 401) {
        alert("Tu sesión ha caducado. Por favor, inicia sesión de nuevo.");
        navigate("/login");
      } else {
        alert(
          "Error al recuperar los platillos. Por favor, inténtalo de nuevo."
        );
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchPlatillos();
  }, [fetchPlatillos]);

  const handleEdit = useCallback((platillo) => {
    setModalState({ type: "edit", platillo });
  }, []);

  const handleDelete = useCallback(async (id) => {
    const userConfirmation = window.confirm(
      "¿Estás seguro de que deseas eliminar este platillo?"
    );
    if (!userConfirmation) return;

    try {
      await axios.delete(`http://localhost:5001/platillos/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setPlatillos((prevPlatillos) => prevPlatillos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar platillo:", error);
      alert("Error al eliminar platillo. Por favor, inténtalo de nuevo.");
    }
  }, []);

  const handleEditSave = useCallback(
    async (editedPlatillo) => {
        const updatedPlatillos = platillos.map((p) =>
            p.id === editedPlatillo.id ? editedPlatillo : p
        );
        setPlatillos(updatedPlatillos);
        fetchPlatillos();  // Esta línea obtiene la lista actualizada de platillos
    },
    [platillos, fetchPlatillos]
);

  const handleAdd = useCallback(
    async (formData) => {
      // <-- Nota el cambio aquí. Ahora recibe el formData directamente
      try {
        const response = await axios.post(
          "http://localhost:5001/platillos",
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setPlatillos((prevPlatillos) => [...prevPlatillos, response.data]);

        closeModal();
        fetchPlatillos();
      } catch (error) {
        console.error("Error al agregar platillo:", error);
        alert("Error al agregar platillo. Por favor, inténtalo de nuevo.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchPlatillos]
  );

  const closeModal = useCallback(() => {
    setModalState({ type: null, platillo: null });
    setSelectedPlatillo(null); // Esta línea deselecciona el platillo cuando cierras el modal.
}, []);

  return (
    <div>
      <h2
        onClick={() => {
          setSelectedSeccion("");
          setSelectedPlatillo(null);
        }}
      >
        Panel de Administración
      </h2>

      {/* Si hay un modal abierto, no mostramos nada más */}
      {modalState.type ? (
        <>
          {modalState.type === "edit" && (
            <EditModal
              platillo={modalState.platillo}
              onSave={handleEditSave}
              onCancel={closeModal}
            />
          )}
          {modalState.type === "add" && (
            <AddModal
              secciones={secciones}
              onSave={handleAdd}
              onCancel={closeModal}
              selectedSeccion={selectedSeccion} // ¡Añade esto!
            />
          )}
        </>
      ) : (
        <>
          {/* Mostrar solo las secciones al principio */}
          {!selectedSeccion &&
            secciones.map((seccion) => (
              <button
                key={seccion.id}
                onClick={() => setSelectedSeccion(seccion.id)}
              >
                {seccion.nombre}
              </button>
            ))}

          {/* Al seleccionar una sección, mostrar botón de añadir platillo y lista de platillos */}
          {selectedSeccion && (
            <>
              <button
                onClick={() => setModalState({ type: "add", platillo: null })}
              >
                Añadir Platillo
              </button>
              <ul>
                {platillos
                  .filter((p) => p.seccion_id === selectedSeccion)
                  .map((platillo) => (
                    <li
                      key={platillo.id}
                      onClick={() => setSelectedPlatillo(platillo)}
                    >
                      <h3>{platillo.nombre}</h3>
                      <p>{platillo.descripcion}</p>
                      <p>Precio: ${platillo.precio}</p>

                      {/* Si este platillo está seleccionado, mostrar opciones */}
                      {selectedPlatillo &&
                        selectedPlatillo.id === platillo.id && (
                          <>
                            <button onClick={() => handleEdit(platillo)}>
                              Editar
                            </button>
                            <button onClick={() => handleDelete(platillo.id)}>
                              Eliminar
                            </button>
                          </>
                        )}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

function EditModal({ platillo, onSave, onCancel }) {
  const [nombre, setNombre] = useState(platillo.nombre);
  const [descripcion, setDescripcion] = useState(platillo.descripcion);
  const [precio, setPrecio] = useState(platillo.precio);
  const [imagen, setImagen] = useState(platillo.imagen);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    if (imagen) formData.append("imagen", imagen);

    try {
        const response = await axios.put(
            `http://localhost:5001/platillos/${platillo.id}`,
            formData,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        onSave(response.data); 
        onCancel();
    } catch (error) {
        console.error("Error al editar platillo:", error);
        alert("Error al editar platillo. Por favor, inténtalo de nuevo.");
    }
};
  return (
    <div className="modal">
      <h3>Editar Platillo</h3>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del platillo"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      />
      <input
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
        type="number"
      />
      <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
      <button onClick={handleSave}>Guardar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

function AddModal({ secciones, onSave, onCancel, selectedSeccion }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState(null);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    if (imagen) formData.append("imagen", imagen);
    formData.append("seccion_id", selectedSeccion); // ¡Usa directamente selectedSeccion aquí!

    onSave(formData);
  };

  return (
    <div className="modal">
      <h3>Añadir Platillo</h3>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del platillo"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      />
      <input
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Precio"
        type="number"
      />
      <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
      
      <button onClick={handleSave}>Guardar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default Admin;
