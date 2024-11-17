import React, { useEffect, useState } from 'react';
import axios from 'axios';
import casaImg from './assets/img/casa.jpg';
import carroImg from './assets/img/carro.jpg';
import reformaImg from './assets/img/reforma.jpg';
import logoImg from './assets/img/logo.png';
import pessoaImg from './assets/img/Pessoa.png';
import './home.css';

const Home = () => {
  const [consorcios, setConsorcios] = useState([]);
  const [filteredConsorcios, setFilteredConsorcios] = useState([]);
  const [currentConsorcioIndex, setCurrentConsorcioIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchConsorcios = async () => {
    try {
      const response = await axios.get('https://localhost:7008/api/Consorcios');
      setConsorcios(response.data);
      setFilteredConsorcios(response.data); // Inicia com todos os consórcios
    } catch (error) {
      console.error('Erro ao buscar consórcios:', error);
    }
  };

  useEffect(() => {
    fetchConsorcios();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentConsorcioIndex((prevIndex) => (prevIndex + 1) % filteredConsorcios.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [filteredConsorcios]);

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

  const handleRedirect = (tipo) => {
    const normalizedTipo = tipo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    switch (normalizedTipo) {
      case 'imovel':
        window.location.href = '/Imovel';
        break;
      case 'carro':
        window.location.href = '/Carro';
        break;
      case 'servico':
        window.location.href = '/Servico';
        break;
      default:
        break;
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = consorcios.filter(consorcio => 
      consorcio.tipo.toLowerCase().includes(searchTerm)
    );
    setFilteredConsorcios(filtered);
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <img src={logoImg} alt="Logo" className="logo" />
        <input 
          type="text" 
          placeholder="Buscar consórcios" 
          className="search-bar" 
          value={searchTerm} 
          onChange={handleSearch} 
        />
        <button className="my-cotas-button" onClick={() => window.location.href = `/MinhasCotas`}> Minhas Cotas</button>
      </nav>

      {/* Carousel Section */}
      <section>
        {filteredConsorcios.length > 0 && (
          <div className="carousel-card">
            <div className="carousel-image-wrapper" onClick={() => handleRedirect(filteredConsorcios[currentConsorcioIndex].tipo)}>
              <img
                src={getImage(filteredConsorcios[currentConsorcioIndex].titulo)}
                alt={filteredConsorcios[currentConsorcioIndex].titulo}
                className="carousel-image fade-in"
              />
              <p className="carousel-impact">
                {filteredConsorcios[currentConsorcioIndex].tipo === 'Imóvel' && <><i className="icon-house" /> A realização de ter seu imóvel próprio.</>}
                {filteredConsorcios[currentConsorcioIndex].tipo === 'Carro' && <><i className="icon-car" /> Conquiste o carro dos seus sonhos.</>}
                {filteredConsorcios[currentConsorcioIndex].tipo === 'Servico' && <><i className="icon-hammer" /> Transforme seu espaço com estilo.</>}
                {!['Imóvel', 'Carro', 'Servico'].includes(filteredConsorcios[currentConsorcioIndex].tipo) && 
                  <>Transforme seu espaço com estilo</>}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Additional Sections */}
      <section className="carousel-section">
        <h2 className="carousel-phrase">Encontre o <span className="highlighted-text">Consórcio</span><br />Perfeito para <span className="highlighted-text">Você. </span></h2>
        <img src={pessoaImg} alt="Imagem Pessoa" className="Pessoa" />
      </section>

      {/* Featured Consorcios */}
      <section className="featured-consorcios">
        <div className="featured-grid">
          {filteredConsorcios.length > 0 && (
            <div className="featured-card">
              <div className="carousel-image-wrapper">
                <img 
                  src={getImage(filteredConsorcios[currentConsorcioIndex].titulo)} 
                  alt={filteredConsorcios[currentConsorcioIndex].titulo} 
                  className="featured-image" 
                />
                <div className="carousel-impact2">
                  <h3 className="texto-consorcios">{filteredConsorcios[currentConsorcioIndex].titulo}</h3>
                  <button className="cotas" onClick={() => handleRedirect(filteredConsorcios[currentConsorcioIndex].tipo)}>Visualizar Cotas</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button 
          className="carousel-nav prev" 
          onClick={() => setCurrentConsorcioIndex((currentConsorcioIndex - 1 + filteredConsorcios.length) % filteredConsorcios.length)}
        >
          &#9664;
        </button>
        <button 
          className="carousel-nav next" 
          onClick={() => setCurrentConsorcioIndex((currentConsorcioIndex + 1) % filteredConsorcios.length)}
        >
          &#9654;
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Consórcios NewM. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
