import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import SharpeRatio from './SharpeRatio';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom"

ReactDOM.render(<BrowserRouter >
    <React.Fragment>
            <nav className="nav">
                <div className="container" id="container">
                    <Link to={`${process.env.PUBLIC_URL}`} className="link">Portfolio Return</Link>
                    <Link to={`${process.env.PUBLIC_URL}/Sharpe`} className="link">Sharpe Ratio</Link>
                </div>
            </nav>
        <Switch>

            <Route path={`${process.env.PUBLIC_URL}/Sharpe`} component={SharpeRatio} />
            <Route path={`${process.env.PUBLIC_URL}`} component={App} />
        </Switch>

    </React.Fragment>
</BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
