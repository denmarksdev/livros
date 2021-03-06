import React, { Component } from 'react';
import InputCustomizado from './componentes/inputCustomizado';
import BotaoCustomizado from './componentes/botaoSubmitCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import { BASE_API } from './Constantes';
import { API_AUTORES } from './Autor';
import TratadorErros from './TratadorErros';
import { LIMPA_ERROS } from './componentes/inputCustomizado';
import { salvaAlteracao  } from './helpers/InputHelper';

const BAD_REQUEST = 400;
const ATUALIZA_LISTA_LIVROS = "atuLivros";
const API_LIVROS =  BASE_API + "/livros";

class FormularioLivro extends Component {

    state = {
        titulo: '',
        preco: 0,
        autorId: 0,
    }

    enviaForm = (event) => {
        event.preventDefault();

        let autorJson = {
            titulo: this.state.titulo,
            preco: this.state.preco,
            autorId: this.state.autorId
        }

        console.log(autorJson);

        $.ajax({
            url: API_LIVROS,
            contentType: "application/json",
            type: "post",
            dataType: "json",
            data: JSON.stringify(autorJson),
            success: livros => {
                this.setState({
                    titulo: '',
                    preco: 0,
                    autorId: 0
                })
                PubSub.publish(ATUALIZA_LISTA_LIVROS, livros);
            },
            error: (resposta) => {
                if (resposta.status === BAD_REQUEST) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: ()=> { PubSub.publish(LIMPA_ERROS)}
        })
    }

    componentWillReceiveProps(){
        this.setState({autorId: this.props.autorSelecionadoId })
    }

    render() {

        return (
            <div className="pure-form">
                <form className="pure-form" onSubmit={this.enviaForm} method="post" >
                    <InputCustomizado id="titulo" name="titulo" label="Titulo" value={this.state.titulo} 
                            onChange={ salvaAlteracao.bind(this,"titulo") } />
                    <InputCustomizado id="preco" name="preco" label="Preço" type="number" value={this.state.preco} 
                            onChange={ salvaAlteracao.bind(this, "preco") } />
                    <div className="pure-control-group">
                        <label>Autor</label>
                        <select name="autorId" defaultValue={this.props.autorSelecionadoId}  
                                onChange={ salvaAlteracao.bind(this, "autorId") }  >
                            {
                                this.props.autores.map(autor =>
                                    <option key={autor.id} value={autor.id}>Autor {autor.nome}</option>
                                )
                            }
                        </select>
                    </div>
                    <BotaoCustomizado label="Salvar" />
                </form>
            </div>
        )
    }
}

class ListagemLivro extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(livro =>
                                <tr key={livro.titulo}>
                                    <td>{livro.titulo}</td>
                                    <td>R${livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default class LivroBox extends Component {

    state = {
        livros: [],
        autores: [],
        autorId: 0,
        autorSelecionadoId :0
    }

    componentDidMount() {
        
        $.ajax({
            url: API_LIVROS,
            contentType: "application/json",
            type: "get",
            dataType: "json",
            success: (livros) => {
                this.setState({ livros });
            },
            error: error => {
                console.log(error);
            }
        })

        $.ajax({
            url: API_AUTORES,
            contentType: "application/json",
            type: "get",
            dataType: "json",
            success: (autores => {
                let autoresOrdenados = autores.sort((a, b) => this.ordenaAutorPorNomeAcendente(a, b))
                let id = autoresOrdenados[0].id;
                
                this.setState({ 
                    autores: autoresOrdenados, 
                    autorSelecionadoId: id
                });
            })
        })

        PubSub.subscribe(ATUALIZA_LISTA_LIVROS, (assunto ,livros) => {
            this.setState( {livros} )
        })
    }

    ordenaAutorPorNomeAcendente(a, b) {
        if (a.nome > b.nome) return -1;
        if (a.nome < b.nome) return 1;
        return 0;
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro 
                        autorSelecionadoId={this.state.autorSelecionadoId}
                        autores={this.state.autores} />
                    <ListagemLivro lista={this.state.livros} />
                </div>
            </div>
        )
    }
}