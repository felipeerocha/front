import React from 'react';
import { Container, Button } from 'reactstrap';

const Home = () => {
    return (
        <div>
            <Container className="p-5 my-5 bg-light rounded">
                <h1 className="display-3"> OláModule Federation </h1>
                <hr className="my-2" />
                <p>Este componente é de outro App!</p>
                <p className="lead">
                    <Button color="primary">Botão</Button>
                </p>
            </Container>
        </div>
    );
};

export default Home;
