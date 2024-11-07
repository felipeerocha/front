import React, { useEffect, useState } from 'react';
import './Cadastro.css';

const Cadastro = () => {
  // Estados para dados da cota, reserva, mensagens de erro e dados do formulário
  const [cota, setCota] = useState({});
  const [reservaConcluida, setReservaConcluida] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    NomeUsuario: '',
    Contato: '',
    Parcelamento: ''
  });

  // Efeito para definir os parâmetros da cota a partir da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCota({
      id: parseInt(params.get('id'), 10) || null,
      numeroCota: params.get('numeroCota') || 'Desconhecido',
      tipo: params.get('tipo') || 'Desconhecido',
      valor: parseFloat(params.get('valor')) || 0,
    });
  }, []);

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Função para concluir a reserva e enviar dados para o backend
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

  // Exibição de mensagem de sucesso caso a reserva seja concluída
  if (reservaConcluida) {
    return (
      <div className="cadastro-cota">
        <h2>Reserva Concluída!</h2>
        <button className="voltar-button" type="button" onClick={() => window.location.href = '/MinhasCotas'}>
          Visualizar Minhas Cotas
        </button>
        <button className="voltar-button" type="button" onClick={() => window.location.href = '/carro'}>
          Voltar
        </button>
      </div>
    );
  }

  // Renderização do formulário de cadastro da cota
  return (
    <div className="cadastro-cota">
      <h2>Cadastro da Cota</h2>
      <form className="cadastro-form">
        <label>ID da Cota:
          <input type="text" value={cota.id || ''} disabled />
        </label>
        <label>Número da Cota:
          <input type="text" value={cota.numeroCota || ''} disabled />
        </label>
        <label>Tipo de Consórcio:
          <input type="text" value={cota.tipo || ''} disabled />
        </label>
        <label>Valor:
          <input type="text" value={cota.valor ? `R$ ${cota.valor.toFixed(2)}` : ''} disabled />
        </label>
        <label>Nome do Usuário:
          <input type="text" name="NomeUsuario" value={formData.NomeUsuario} onChange={handleInputChange} />
        </label>
        <label>Contato:
          <input type="text" name="Contato" value={formData.Contato} onChange={handleInputChange} />
        </label>
        <label>Parcelamento:
          <input type="text" name="Parcelamento" value={formData.Parcelamento} onChange={handleInputChange} />
        </label>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="voltar-button" type="button" onClick={() => window.location.href = '/carro'}>
        Voltar
      </button>
      <button className="reservar-button" type="button" onClick={handleConcluirReserva}>
        Concluir Reserva
      </button>
      <button className="cancelar-button" type="button" onClick={() => window.location.href = '/carro'}>
        Cancelar Reserva
      </button>
    </div>
  );
};

export default Cadastro;
