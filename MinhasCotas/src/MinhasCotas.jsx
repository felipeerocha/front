import React, { useState } from 'react';
import './MinhasCotas.css';

const MinhasCotas = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState({ nomeUsuario: '', numeroCota: '' });
  const [cotas, setCotas] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const authHeader = 'Basic ' + btoa(`${authData.nomeUsuario}:${authData.numeroCota}`);
      const response = await fetch('https://localhost:7008/api/Cadastro', {
        method: 'GET',
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

      const data = await response.json();
      const userCotas = data.filter(cadastro => cadastro.nomeUsuario === authData.nomeUsuario);

      if (userCotas.length === 0) throw new Error("Esse usuário não possui cadastro de cotas.");

      const visualizacaoCotas = userCotas.map(cota => ({
        id: cota.id || 'Não especificado',
        tipo: cota.tipoConsorcio || 'Consórcio Carro',
        numeroCota: cota.numeroCota,
        valor: cota.valorCota || 'Não especificado'
      }));

      setCotas(visualizacaoCotas);
      setIsAuthenticated(true);
    } catch (error) {
      setErrorMessage('Erro ao autenticar. Verifique os dados e tente novamente.');
      console.error('Erro ao autenticar:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCotas([]);
    setAuthData({ nomeUsuario: '', numeroCota: '' });
    setErrorMessage('');
  };

  const handleDeleteCota = async (cotaId) => {
    try {
      const authHeader = 'Basic ' + btoa(`${authData.nomeUsuario}:${authData.numeroCota}`);
      const response = await fetch(`https://localhost:7008/api/Cotas/${cotaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });

      if (response.ok) {
        setCotas(cotas.filter((cota) => cota.id !== cotaId));
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao excluir a cota:', error);
      setErrorMessage('Não foi possível excluir a cota. Tente novamente.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-form">
        <h2>Login para Minhas Cotas</h2>
        <label>
          Nome do Usuário:
          <input
            type="text"
            name="nomeUsuario"
            value={authData.nomeUsuario}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Número da Cota:
          <input
            type="password"
            name="numeroCota"
            value={authData.numeroCota}
            onChange={handleInputChange}
          />
        </label>
        <div className="button-group">
          <button className="voltar-button" type="button" onClick={() => window.location.href = '/'}>
            Voltar Início
          </button>
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="minhas-cotas">
      <h2>Bem-vindo, {authData.nomeUsuario}</h2>
      <button onClick={handleLogout}>Logout</button>
      {cotas.length === 0 ? (
        <p>Nenhum cadastro encontrado.</p>
      ) : (
<ul>
  {cotas.map((cota) => (
    <li key={cota.numeroCota}>
      <p><strong>ID da Cota:</strong> {cota.id}</p>
      <p><strong>Tipo de Consórcio:</strong> {cota.tipo || 'Não especificado'}</p>
      <p><strong>Número da Cota:</strong> {cota.numeroCota}</p>
      <p><strong>Valor:</strong> {cota.valor || 'Não preenchido'}</p>
      <button className="excluir-button" onClick={() => handleDeleteCota(cota.numeroCota)}>
        Excluir Reserva
      </button>
      <button className="editar-button" onClick={() => window.location.href = `/editar-cota?id=${cota.numeroCota}`}>
        Editar Reserva
      </button>
    </li>
  ))}
</ul>
      )}
    </div>
  );
};

export default MinhasCotas;
