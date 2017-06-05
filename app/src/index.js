import React, { Component } from 'react'
import { render } from 'react-dom'
import oi from './oi'

console.log(oi) 

class App extends Component {
    render(){
        return <h1>Teco</h1> 
    }
}

render(<App />,document.getElementById('app'))