import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import casaImg from './assets/img/casa.jpg'; 
import carroImg from './assets/img/carro.jpg';
import reformaImg from './assets/img/reforma.jpg';
import logoImg from './assets/img/logo.png'; 
import './home.css';

const Home = () => {
    const [consorcios, setConsorcios] = useState([]);

    const fetchConsorcios = async () => {
        try {
            const response = await axios.get('https://localhost:7008/api/Consorcios');
            setConsorcios(response.data);
        } catch (error) {
            console.error('Erro ao buscar consórcios:', error);
        }
    };

    useEffect(() => {
        fetchConsorcios();
    }, []);

    const getImage = (titulo) => {
        switch (titulo.toLowerCase()) {
            case 'consórcio de casa':
                return casaImg;
            case 'consórcio de carro':
                return carroImg;
            case 'consórcio de reforma':
                return reformaImg;
            default:
                return null;
        }
    };

    return (
        <div>
            <Container className="blocos">
                <img src={logoImg} alt="Logo NewM" className="logo-image" /> {/* Corrigido para exibir a logo */}
                <h1 className="display-3">Consórcios</h1>
                <hr className="my-2" />
                <p className="my-4">Escolha o seu tipo de produto!</p>

                <Row>
                    {consorcios.length > 0 ? (
                        consorcios.map((consorcio) => (
                            <Col sm="4" key={consorcio.id} className="mb-4">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">{consorcio.titulo}</CardTitle>
                                        <img
                                            src={getImage(consorcio.titulo)}
                                            alt={consorcio.titulo}
                                            className="consorcio-image"
                                        />
                                        <CardText className="consorcio-titulo">
                                            Tipo: {consorcio.tipo} <br />
                                            Valor: R${consorcio.valor.toLocaleString('pt-BR')} <br />
                                        </CardText>
                                        <CardText className="consorcio-quantidades">
                                            Quantidade de Cotas: {consorcio.quantidadeCotas}
                                        </CardText>
                                        <Button color="primary">Visualizar Cotas</Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>Carregando consórcios...</p>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Home;
