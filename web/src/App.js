import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Selector from './Selector';

class App extends Component {
    // componentDidMount() {
    //     fetch(" https://a7c394a7.ngrok.io", {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             firstParam: 'yourValue',
    //             secondParam: 'yourOtherValue',
    //         })
    //     })
    // }

    render() {
        // ...
        return (
            <div className="App">
                <Selector />
            </div >
        )

    }
}

export default App;
