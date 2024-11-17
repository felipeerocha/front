import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { concluirReservaAsync, setCotaAtual, resetReserva } from '../../app/src/redux/slices/cotasSlice';
import store from '../../app/src/redux/store';
import './Cadastro.css';

const Cadastro = ({ isEditMode = false }) => {
  const dispatch = useDispatch();
  const reservaConcluida = useSelector((state) => state.cotas.reservaConcluida);
  const errorMessage = useSelector((state) => state.cotas.errorMessage);
  const cota = useSelector((state) => state.cotas.cotaAtual);

  const [formData, setFormData] = useState({
    NomeUsuario: '',
    Contato: '',
    Parcelamento: '1',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    dispatch(setCotaAtual({
      id: parseInt(params.get('id'), 10) || null,
      numeroCota: params.get('numeroCota') || 'Desconhecido',
      tipo: params.get('tipo') || 'Desconhecido',
      valor: parseFloat(params.get('valor')) || 0,
    }));
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleConcluirReserva = () => {
    const parcelas = parseInt(formData.Parcelamento, 10);
    const valorParcela = cota.valor ? (cota.valor / parcelas).toFixed(2) : '0.00';
    const parcelamentoFormatado = `${parcelas}x de R$ ${valorParcela}`;

    dispatch(concluirReservaAsync({
      cotaId: cota.id,
      numeroCota: cota.numeroCota,
      nomeUsuario: formData.NomeUsuario,
      contato: formData.Contato,
      parcelamento: parcelamentoFormatado,
      tipo: cota.tipo,
      valor: cota.valor,
    }));
  };

  if (reservaConcluida && !isEditMode) {
    return (
      <div className="cadastro-cota">
        <h2>Reserva Concluída!</h2>
        <div className="reserva-concluida">
          <span className="reserva-concluida-icon">✔️</span>
          <div>
            <p>O seu usuário é: <strong>{formData.NomeUsuario}</strong></p>
            <p>Número da cota: <strong>{cota.numeroCota}</strong></p>
          </div>
        </div>
        <button className="voltar-button" type="button" onClick={() => window.location.href = '/MinhasCotas'}>
          Visualizar Minhas Cotas
        </button>
        <button className="voltar-button" type="button" onClick={() => window.location.href = '/'}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="cadastro-cota">
      <h2>{isEditMode ? 'Editar Cota' : 'Reserva de Cota'}</h2>
      <div className="cadastro-container">
        <form className="cota-info" onSubmit={(e) => e.preventDefault()}>
          <label>ID da Cota:
            <input type="text" value={cota.id || ''} readOnly />
          </label>
          <label>Número da Cota:
            <input type="text" value={cota.numeroCota || ''} readOnly />
          </label>
          <label>Tipo de Consórcio:
            <input type="text" value={cota.tipo || ''} readOnly />
          </label>
          <label>Valor:
            <input type="text" value={cota.valor ? `R$ ${cota.valor.toFixed(2)}` : ''} readOnly />
          </label>
        </form>
        <form className="cadastro-form">
          <label>Nome do Usuário:
            <input type="text" name="NomeUsuario" value={formData.NomeUsuario} onChange={handleInputChange} />
          </label>
          <label>Contato:
            <input type="text" name="Contato" value={formData.Contato} onChange={handleInputChange} />
          </label>
          <label>Parcelamento:
            <select name="Parcelamento" value={formData.Parcelamento} onChange={handleInputChange}>
              {[...Array(12).keys()].map(i => {
                const parcelas = i + 1;
                const valorParcela = cota.valor ? (cota.valor / parcelas).toFixed(2) : '0.00';
                return <option key={parcelas} value={parcelas}>{parcelas}x de R$ {valorParcela}</option>;
              })}
            </select>
          </label>
        </form>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="button-group">
        <button className="voltar-button" type="button" onClick={() => window.location.href = '/'}>
          Voltar
        </button>
        <button className="reservar-button" type="button" onClick={handleConcluirReserva}>
          {isEditMode ? 'Salvar Alterações' : 'Concluir Reserva'}
        </button>
        <button className="cancelar-button" type="button" onClick={() => dispatch(resetReserva())}>
          Cancelar Reserva
        </button>
      </div>
    </div>
  );
};

const CadastroWithProvider = () => (
  <Provider store={store}>
    <Cadastro />
  </Provider>
);

export default CadastroWithProvider;
