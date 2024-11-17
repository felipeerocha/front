import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../app/src/redux/slices/authSlice';
import store from '../../app/src/redux/store';
import './MinhasCotas.css';

const MinhasCotasContent = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [authData, setAuthData] = useState({ nomeUsuario: '', numeroCota: '' });
  const [cadastros, setCadastros] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ show: false, cadastroId: null });
  const [searchId, setSearchId] = useState(''); // New state for search bar

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
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
      const userCadastros = data.filter(cadastro => cadastro.nomeUsuario === authData.nomeUsuario);

      if (userCadastros.length === 0) throw new Error("Esse usuário não possui cadastro de cotas.");

      const visualizacaoCadastros = userCadastros.map(cadastro => ({
        id: cadastro.id,
        tipo: cadastro.tipo ? cadastro.tipo : 'Tipo de consórcio não especificado',
        numeroCota: cadastro.numeroCota,
        valor: cadastro.valor !== undefined ? `R$ ${parseFloat(cadastro.valor).toFixed(2)}` : 'Valor não especificado',
        parcelamento: cadastro.parcelamento
      }));

      setCadastros(visualizacaoCadastros);
      dispatch(login(authData));
    } catch (error) {
      setErrorMessage('Erro ao autenticar. Verifique os dados e tente novamente.');
      console.error('Erro ao autenticar:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setCadastros([]);
    setAuthData({ nomeUsuario: '', numeroCota: '' });
    setErrorMessage('');
  };

  const handleDeleteCadastro = async () => {
    try {
      const authHeader = 'Basic ' + btoa(`${authData.nomeUsuario}:${authData.numeroCota}`);
      const response = await fetch(`https://localhost:7008/api/Cadastro/${confirmDelete.cadastroId}`, {
        method: 'DELETE',
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });

      if (response.ok) {
        setCadastros(cadastros.filter((cadastro) => cadastro.id !== confirmDelete.cadastroId));
        setConfirmDelete({ show: false, cadastroId: null });
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao excluir o cadastro:', error);
      setErrorMessage('Não foi possível excluir o cadastro. Tente novamente.');
    }
  };

  const filteredCadastros = cadastros.filter((cadastro) =>
    searchId ? cadastro.id.toString().includes(searchId) : true
  );

  if (!isAuthenticated) {
    return (
      <div className="login-form">
        <h2>Login</h2>
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
      <h2>Bem-vindo, {user.nomeUsuario}</h2>
      <div className="search-container">
        <label htmlFor="searchId">Buscar Cadastro:</label>
        <input
          type="text"
          id="searchId"
          value={searchId}
          onChange={handleSearchChange}
          placeholder="Digite o ID do cadastro"
        />
      </div>
      {filteredCadastros.length === 0 ? (
        <p>Nenhum cadastro encontrado.</p>
      ) : (
        <ul>
            {confirmDelete.show && (
        <div className="confirm-delete">
          <p>Deseja realmente excluir a reserva?</p>
          <button className="confirm-button" onClick={handleDeleteCadastro}>Confirmar</button>
          <button className="cancel-button" onClick={() => setConfirmDelete({ show: false, cadastroId: null })}>Cancelar</button>
        </div>
      )}
          {filteredCadastros.map((cadastro) => (
            <li key={cadastro.numeroCota}>
              <p><strong>ID do Cadastro:</strong> {cadastro.id}</p>
              <p><strong>Tipo de Consórcio:</strong> {cadastro.tipo}</p>
              <p><strong>Número da Cota:</strong> {cadastro.numeroCota}</p>
              <p><strong>Valor:</strong> {cadastro.valor}</p>
              <p><strong>Parcelamento:</strong> {cadastro.parcelamento}</p>
              <button className="excluir-button" onClick={() => setConfirmDelete({ show: true, cadastroId: cadastro.id })}>
                Excluir Cadastro
              </button>
              <button className="editar-button" onClick={() => window.location.href = `/Editar?cotaId=${cota.id}&numeroCota=${cota.numeroCota}&nomeUsuario=${formData.NomeUsuario}&contato=${formData.Contato}&parcelamento=${parcelamentoFormatado}&tipo=${cota.tipo}&valor=${cota.valor}`}>
                Editar Cadastro
              </button>
              
            </li>
          ))}
          
        </ul>
      )}
          <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
  
};

// Envolver com Provider apenas se ele não for renderizado dentro do App principal
const MinhasCotas = () => (
  <Provider store={store}>
    <MinhasCotasContent />
  </Provider>
);

export default MinhasCotas;
