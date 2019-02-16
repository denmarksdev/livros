export function salvaAlteracao(nomeInput,evento){
    var campo = {};
    campo[nomeInput] = evento.target.value;
    this.setState(campo);
  }