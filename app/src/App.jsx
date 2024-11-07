import React, { Suspense } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

// CSS
import './app.css';

const App = () => {
    const HomePage = React.lazy(() => import("HomeApp/HomePage"));
    const ImovelPage = React.lazy(() => import("ImovelApp/ImovelPage"));
    const CarroPage = React.lazy(() => import("CarroApp/CarroPage"));
    const ServicoPage = React.lazy(() => import("ServicoApp/ServicoPage"));
    const CadastroPage = React.lazy(() => import("CadastroApp/CadastroPage"));
    const MinhasCotasPage = React.lazy(() => import("MinhasCotasApp/MinhasCotasPage"));

    return (
        <Router>
            <div>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <HomePage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/Imovel"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <ImovelPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/Carro"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <CarroPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/Servico"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <ServicoPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/Cadastro"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <CadastroPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/MinhasCotas"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <MinhasCotasPage />
                            </Suspense>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
