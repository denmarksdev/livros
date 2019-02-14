import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import './App.css';
import $ from 'jquery';
import InputCustomizado  from './componentes/inputCustomizado';
import BotaoCustomizado  from './componentes/botaoSubmitCustomizado';

const BASE_API = "http://localhost:8080/api/autores";

class App extends Component {

  state = {
    lista: [],
    nome: '',
    email: '',
    senha: ''
  };

  componentDidMount() {
    $.ajax({
      url: BASE_API,
      dataType: 'json',
      success: lista => { this.setState({ lista }) }
    })
  }

  enviaForm = (evento) => {
    evento.preventDefault();
    
    let autorJSON = {
      nome: this.state.nome,
      email: this.state.email,
      senha: this.state.senha
    };

    $.ajax({
      url: BASE_API,
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify(autorJSON),
      success: lista => {
        this.setState({
           lista
        })
      },
      error: error => {
        console.log(error);
      }
    })
  }

  setNome = (evento) =>{
    this.setState(
      {nome:evento.target.value}
    );
  }

  setEmail = (evento) =>{
    console.log(evento);
    this.setState(
      {email:evento.target.value}
    );
  }

  setSenha = (evento) =>{
    this.setState(
      {senha:evento.target.value}
    );
  }

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
          <div className="content" id="content">
            <div className="pure-form">
              <form className="pure-form" onSubmit={this.enviaForm} method="post" >
              <InputCustomizado id="nome"  name="nome"  label="Nome"  value={this.state.nome} onChange={this.setNome}  />
              <InputCustomizado id="email" name="email" label="Email" type="email" value={this.state.email}  onChange={this.setEmail}  />
              <InputCustomizado id="senha" name="senha" label="Senha" type="password" value={this.state.senha} onChange={this.setSenha}  />
              <BotaoCustomizado label="Salvar" />
              </form>
            </div>
            <div>
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.lista.map(autor =>
                      <tr key={autor.id} >
                        <td>{autor.nome}</td>
                        <td>{autor.email}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default App;
