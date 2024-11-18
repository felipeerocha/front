import React from 'react';
import { ApolloProvider, gql, useQuery } from '@apollo/client';
import client from './apolloClient'; // Importação do cliente Apollo configurado
import './carro.css';

// Definindo a query GraphQL
const GET_COTAS = gql`
  query {
    getCotas {
      id
      numeroCota
      tipo
      status
      valor
    }
  }
`;

const CarroComponent = () => {
  // Usando o hook useQuery para buscar os dados
  const { data, loading, error } = useQuery(GET_COTAS);

  // Mensagem de carregamento
  if (loading) return <p>Carregando...</p>;

  // Mensagem de erro
  if (error) return <p>Erro ao buscar as cotas: {error.message}</p>;

  // Verificação e filtragem das cotas para consorcioId === 2
  const cotasDoConsorcio2 = data?.getCotas?.filter((cota) => cota.tipo === 'Carro') || [];

  const navegarParaCadastro = (id, numeroCota, tipo, valor) => {
    const url = `/Cadastro?id=${id}&numeroCota=${numeroCota}&tipo=${tipo}&valor=${valor}`;
    window.location.href = url;
  };

  const reservarCota = (cota) => {
    if (cota.status === 'Disponível') {
      navegarParaCadastro(cota.id, cota.numeroCota, cota.tipo, cota.valor);
    }
  };

  return (
    <div className="container-cotas">
      <button className="my-cotas-button" onClick={() => window.location.href = '/MinhasCotas'}>Minhas Cotas</button>
      <h2 className="titulo">Escolha uma Cota</h2>
      <div className="cotas-grid">
        {cotasDoConsorcio2.length > 0 ? (
          cotasDoConsorcio2.map((cota) => (
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
          ))
        ) : (
          <p>Nenhuma cota disponível para este consórcio.</p>
        )}
      </div>
      <button className="voltar-button" type="button" onClick={() => window.location.href = '/'}>
        Voltar
      </button>
    </div>
  );
};

const Carro = () => (
  <ApolloProvider client={client}>
    <CarroComponent />
  </ApolloProvider>
);

export default Carro;
