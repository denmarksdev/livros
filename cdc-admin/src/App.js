import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import './App.css';
import {Link} from 'react-router';

class App extends Component {

  state = {
    estilo: {}
  }

  ativo = false;

  offsetCanvas = ()=>  {

    this.ativo = !this.ativo;

    if (this.ativo){
      this.setState({
        estilo : {marginLeft:"0px"}
      })
    } else {
      this.setState({
        estilo : {}
      })
    }
  }


  render() {
    return (
      <div id="layout">
      
        <a href="#menu" id="menuLink" className="menu-link" onClick={this.offsetCanvas} >
          <span></span>
        </a>
        <nav id="menu"  style={ this.state.estilo }  onClick={this.offsetCanvas}  >
          <a className="pure-menu-heading" href="#">LIVROS WEB</a>
          <div className="pure-menu">
            <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <Link  to="/" className="pure-menu-link">Home</Link>
              </li>
              <li className="pure-menu-item">
                <Link to="/autor" className="pure-menu-link">Autor</Link>
              </li>
              <li className="pure-menu-item">
                <Link to="/livro" className="pure-menu-link">Livros</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div id="main">
          {this.props.children}
        </div>
      </div>
    )
  }



}

export default App;
