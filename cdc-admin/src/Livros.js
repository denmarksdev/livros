import React, { Component } from 'react';
import InputCustomizado from './componentes/inputCustomizado';
import BotaoCustomizado from './componentes/botaoSubmitCustomizado';
import { API_LIVROS, BASE_API } from './Constantes';
import $ from 'jquery';
import TratadorErros from './TratadorErros';
import PubSub from 'pubsub-js';


const BAD_REQUEST = 400;
const ATUALIZA_LISTA_LIVROS = "atuLivros";

class FormularioLivro extends Component {

    state = {
        titulo: '',
        preco: 0,
        autorId: 0,
        autores: []
    }

    componentDidMount() {

        $.ajax({
            url: BASE_API,
            contentType: "application/json",
            type: "get",
            dataType: "json",
            success: (autores => {
                var autores = autores.sort((a, b) => this.ordenaAutorPorNomeAcendente(a, b))
                var primeroAutorId = autores[0].id
                this.setState({ autores, autorId: primeroAutorId });
            })
        })

    }

    setTitulo = (event) => {
        this.setState(
            { titulo: event.target.value }
        );
    }

    setPreco = (event) => {
        this.setState(
            { preco: event.target.value }
        );
    }

    setAutorId = (event) => {
        this.setState(
            { autorId: parseInt(event.target.value) }
        );
    }

    enviaForm = (event) => {
        event.preventDefault();

        let autorJson = {
            titulo: this.state.titulo,
            preco: this.state.preco,
            autorId: this.state.autorId
        }

        $.ajax({
            url: API_LIVROS,
            contentType: "application/json",
            type: "post",
            dataType: "json",
            data: JSON.stringify(autorJson),
            success: livros => {
                PubSub.publish(ATUALIZA_LISTA_LIVROS, livros);
            },
            error: (resposta) => {
                if (resposta.status === BAD_REQUEST) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            }
        })
    }

    ordenaAutorPorNomeAcendente(a, b) {
        if (a.nome > b.nome) return -1;
        if (a.nome < b.nome) return 1;
        return 0;
    }

    render() {

        return (
            <div className="pure-form">
                <form className="pure-form" onSubmit={this.enviaForm} method="post" >
                    <InputCustomizado id="titulo" name="titulo" label="Titulo" value={this.state.titulo} onChange={this.setTitulo} />
                    <InputCustomizado id="preco" name="preco" label="Preço" type="number" value={this.state.preco} onChange={this.setPreco} />
                    <div className="pure-control-group">
                        <label>Autor</label>
                        <select name="autorId" onChange={this.setAutorId} >
                            {
                                this.state.autores.map(autor =>
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
        livros: []
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

        PubSub.subscribe(ATUALIZA_LISTA_LIVROS, (assunto ,livros) => {
            this.setState( {livros} )
        })
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro />
                    <ListagemLivro lista={this.state.livros} />
                </div>
            </div>
        )
    }
}