import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado, { LIMPA_ERROS } from './componentes/inputCustomizado';
import BotaoCustomizado from './componentes/botaoSubmitCustomizado';
import { BASE_API } from './Constantes';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';
import { salvaAlteracao  } from './helpers/InputHelper';

const ATUALIZA_LISTA_AUTORES = "atuAutores";
export const API_AUTORES = BASE_API + "/autores"

class FormularioAutor extends Component {

  state = {
    nome: '',
    email: '',
    senha: ''
  };

  enviaForm = (evento) => {

    evento.preventDefault();

    let autorJSON = {
      nome: this.state.nome,
      email: this.state.email,
      senha: this.state.senha
    };

    $.ajax({
      url: API_AUTORES,
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify(autorJSON),
      success: lista => {
        PubSub.publish(ATUALIZA_LISTA_AUTORES, lista);
        this.setState({ nome: '', email: '', senha: '' });
      },
      error: resposta => {
        if (resposta.status === 400) {
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: () => {
        PubSub.publish(LIMPA_ERROS);
      }
    })
  }

  render() {
    return (
      <div className="pure-form">
        <form className="pure-form" onSubmit={this.enviaForm} method="post" >
          <InputCustomizado id="nome" name="nome" label="Nome" value={this.state.nome} 
                onChange={ salvaAlteracao.bind(this,"nome") } />
          <InputCustomizado id="email" name="email" label="Email" type="email" value={this.state.email} 
                onChange={ salvaAlteracao.bind(this,"email") } />
          <InputCustomizado id="senha" name="senha" label="Senha" type="password" value={this.state.senha} 
                onChange={ salvaAlteracao.bind(this,"senha") } />
          <BotaoCustomizado label="Salvar" />
        </form>
      </div>
    )
  }
}

class TabelaAutores extends Component {

  render() {
    return (
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
              this.props.lista.map(autor =>
                <tr key={autor.id} >
                  <td>{autor.nome}</td>
                  <td>{autor.email}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default class AutorBox extends Component {

  state = {
    lista: [],
  };

  componentDidMount() {
    $.ajax({
      url: API_AUTORES,
      dataType: 'json',
      success: lista => {
        this.setState({ lista })
      }
    })

    PubSub.subscribe(ATUALIZA_LISTA_AUTORES, (topico, lista) => {
      this.setState({ lista });
    })
  }

  atualizaListagem = (lista) => {
    this.setState({ lista })
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de Autores</h1>
        </div>
        <div className="content" id="content">
          <FormularioAutor />
          <TabelaAutores lista={this.state.lista} />
        </div>
      </div>
    )
  }

}