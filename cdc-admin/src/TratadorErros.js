import PubSub from 'pubsub-js';

export const ERRO_VALIDACAO = "erroValidacao";

export default class TratadorErros {
    publicaErros(info){     
        for (let index = 0; index < info.errors.length; index++) {
            let erro = info.errors[index];
            PubSub.publish(ERRO_VALIDACAO, erro);
        }
    }
}
