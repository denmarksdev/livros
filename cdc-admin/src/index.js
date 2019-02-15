import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AutorBox from './Autor';

import * as serviceWorker from './serviceWorker';
//import { Router, Route , browserHistory, IndexRoute } from 'react-router'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import HomeComponent from './Home';
import LivroBox  from './Livros';

ReactDOM.render(
    (<Router>
        <App>
            <switch>
                <Route exact path="/" component={HomeComponent} />
                <Route path="/autor" component={AutorBox} />
                <Route path="/livro" component={LivroBox} />
            </switch>
        </App>
    </Router>)
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
