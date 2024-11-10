import React, { useEffect, useState } from 'react';
import './Cadastro.css';

const Cadastro = () => {
  const [cota, setCota] = useState({});
  const [reservaConcluida, setReservaConcluida] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    NomeUsuario: '',
    Contato: '',
    Parcelamento: '1'
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCota({
      id: parseInt(params.get('id'), 10) || null,
      numeroCota: params.get('numeroCota') || 'Desconhecido',
      tipo: params.get('tipo') || 'Desconhecido',
      valor: parseFloat(params.get('valor')) || 0,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleConcluirReserva = async () => {
    setErrorMessage('');
    try {
      const response = await fetch(`https://localhost:7008/api/Cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          CotaId: cota.id,
          NumeroCota: cota.numeroCota,
          NomeUsuario: formData.NomeUsuario,
          Contato: formData.Contato,
          Parcelamento: formData.Parcelamento,
          DataCadastro: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
      setReservaConcluida(true);
    } catch (error) {
      console.error('Erro ao concluir a reserva:', error);
      setErrorMessage('Não foi possível concluir a reserva. Tente novamente.');
    }
  };

  if (reservaConcluida) {
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
      <h2>Cadastro da Cota</h2>
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
                const valorParcela = (cota.valor / parcelas).toFixed(2);
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
          Concluir Reserva
        </button>
        <button className="cancelar-button" type="button" onClick={() => window.location.href = '/'}>
          Cancelar Reserva
        </button>
      </div>
    </div>
  );
};

export default Cadastro;
