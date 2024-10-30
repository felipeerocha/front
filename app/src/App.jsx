import React, { Suspense } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';

// css
import './app.css';

const App = () => {
    
    const HomePage = React.lazy(() => import("HomeApp/HomePage"));
    const ImovelPage = React.lazy(() => import("ImovelApp/ImovelPage"));
    const CarroPage = React.lazy(() => import("CarroApp/CarroPage"));
    const ServicoPage = React.lazy(() => import("ServicoApp/ServicoPage"));

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
                </Routes>
            </div>
        </Router>
    );
};

export default App;