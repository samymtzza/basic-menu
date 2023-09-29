import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';  

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:5001/login', { username, password });
            console.log(response.data);
            if (response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                login(response.data.accessToken);
                navigate('/admin');  // Esto debería redirigir al usuario a la página /admin
            } else {
                setError('Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
            setError('Error en el inicio de sesión. Por favor, verifica tus credenciales.');
        }
    };
    
    return (
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Nombre de usuario:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    );
}

export default Login;






