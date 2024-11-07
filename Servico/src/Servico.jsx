import React, { useEffect, useState } from 'react';
import './servico.css';

const Servico = () => {
    const [cotas, setCotas] = useState([]);

    useEffect(() => {
        const fetchCotas = async () => {
            try {
                const response = await fetch('https://localhost:7008/api/Cotas');
                const data = await response.json();

                // Filtra cotas para exibir apenas as do consórcio com ID 1
                const cotasDoConsorcio3 = data.filter((cota) => cota.consorcioId === 3);
                setCotas(cotasDoConsorcio3);
            } catch (error) {
                console.error('Erro ao buscar as cotas:', error);
            }
        };

        fetchCotas();
    }, []);

    const reservarCota = (cotaId) => {
        console.log(`Cota reservada: ${cotaId}`);
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
                            <span
                                className={cota.status === 'Disponível' ? 'status-disponivel' : 'status-ocupada'}
                            >
                                Status: {cota.status}
                            </span>
                        </div>
                        <button
                            className="reservar-button"
                            onClick={() => reservarCota(cota.id)}
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

export default Servico;
