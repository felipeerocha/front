import React from 'react';
import { ApolloProvider, gql, useQuery } from '@apollo/client';
import client from './apolloClient'; // Importação do cliente Apollo configurado
import './servico.css';

// Definindo a query GraphQL
const GET_COTAS_SERVICO = gql`
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

const ServicoComponent = () => {
  // Usando o hook useQuery para buscar os dados
  const { data, loading, error } = useQuery(GET_COTAS_SERVICO);

  // Mensagem de carregamento
  if (loading) return <p>Carregando...</p>;

  // Mensagem de erro
  if (error) return <p>Erro ao buscar as cotas: {error.message}</p>;

  // Filtrando as cotas para consorcioId === 3 (Serviço)
  const cotasDoConsorcio3 = data?.getCotas?.filter((cota) => cota.tipo === 'Serviço') || [];

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
      <button className="my-cotas-button" onClick={() => window.location.href = '/MinhasCotas'}>
        Minhas Cotas
      </button>
      <h2 className="titulo">Escolha uma Cota</h2>
      <div className="cotas-grid">
        {cotasDoConsorcio3.length > 0 ? (
          cotasDoConsorcio3.map((cota) => (
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

const Servico = () => (
  <ApolloProvider client={client}>
    <ServicoComponent />
  </ApolloProvider>
);

export default Servico;
