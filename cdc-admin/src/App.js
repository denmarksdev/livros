import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import './App.css';

import AutorBox from './Autor';

class App extends Component {

  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>
        <nav id="menu">
          <a className="pure-menu-heading" href="#">LIVROS WEB</a>
          <div className="pure-menu">
            <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <a href="#" className="pure-menu-link">Home</a>
              </li>
              <li className="pure-menu-item">
                <a href="#" className="pure-menu-link">Autor</a>
              </li>
              <li className="pure-menu-item">
                <a href="#" className="pure-menu-link">Livro</a>
              </li>
            </ul>
          </div>
        </nav>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <AutorBox />
        </div>
      </div>
    )
  }
}

export default App;
