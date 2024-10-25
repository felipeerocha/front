import React, { Suspense } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'reactstrap';

// css
import './app.css';

const App = () => {
    
    const HomePage = React.lazy(() => import("HomeApp/HomePage"));
    const ContactPage = React.lazy(() => import("ContactApp/ContactPage"));

    return (
        <Router>
            <div>
                <Navbar color="light" light expand="md">
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <Link to="/">Home</Link>
                        </NavItem>
                        <NavItem>
                            <Link to="/contact">Contact</Link>
                        </NavItem>
                    </Nav>
                </Navbar>
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
                        path="/contact"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <ContactPage />
                            </Suspense>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
