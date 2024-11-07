import React, { useEffect, useState } from 'react';
import './carro.css';

const Carro = () => {
  const [cotas, setCotas] = useState([]);

  useEffect(() => {
    const fetchCotas = async () => {
      try {
        const response = await fetch('https://localhost:7008/api/Cotas');
        const data = await response.json();
        const cotasDoConsorcio2 = data.filter((cota) => cota.consorcioId === 2);
        setCotas(cotasDoConsorcio2);
      } catch (error) {
        console.error('Erro ao buscar as cotas:', error);
      }
    };

    fetchCotas();
  }, []);

  const navegarParaCadastro = (id, numeroCota, tipo, valor) => {
    const url = `/Cadastro?id=${id}&numeroCota=${numeroCota}&tipo=${tipo}&valor=${valor}`;
    window.location.href = url;
  };

  const reservarCota = (cota) => {
    if (cota.status === 'Disponível') {
      navegarParaCadastro(cota.id, cota.numeroCota, 'Carro', cota.valor);
    }
  };

  return (
    <div className="container-cotas">
      <h2 className="titulo">Escolha uma Cota</h2>
      <div className="cotas-grid">
        {cotas.map((cota) => (
          <div className="cota-card" key={cota.id}>
            <div className="cota-info">
              <span>Número da Cota: {cota.numeroCota}</span>
              <span>Valor: R$ {cota.valor.toFixed(2)}</span>
              <span className={cota.status === 'Disponível' ? 'status-disponivel' : 'status-ocupada'}>
                Status: {cota.status}
              </span>
            </div>
            <button
              className="reservar-button"
              onClick={() => reservarCota(cota)}
              disabled={cota.status !== 'Disponível'}
            >
              Reservar Cota
            </button>
          </div>
        ))}
      </div>
      <button className="voltar-button" type="button" onClick={() => window.location.href = '/'}>
        Voltar
      </button>
    </div>
  );
};

export default Carro;
