import React, {Component} from 'react';
import PubSub from 'pubsub-js';
import {ERRO_VALIDACAO} from '../TratadorErros';

export const LIMPA_ERROS = "limpa-erros";

 class InputCustomizado extends Component {

    state = {
        msgErro:''
    }

    render() {
        return (
            <div className="pure-control-group">
                  <label htmlFor={this.props.id}>{this.props.label}</label>
                  <input {...this.props} />
                    <span className="error">{this.state.msgErro}</span>
            </div>
        )
    }

    componentWillMount(){
        PubSub.subscribe(ERRO_VALIDACAO, (topico,erro) =>{
            if ( erro.field === this.props.name){
                this.setState({msgErro: erro.defaultMessage});
            }
        });
        PubSub.subscribe(LIMPA_ERROS , (topico)=> {
            this.setState({msgErro: '' })
        })
    }
}

export default InputCustomizado;