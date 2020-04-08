import React, {Component} from 'react';
import './App.css';

class InitialApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            greeting: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch(`/api/apilog`)
            .then(response => response.json())
            .then(state => this.setState(state))
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="name">Enter your name: </label>
                <input
                    id="name"
                    type="text"
                    value={this.state.name}
                    onChange={this.handleChange}
                />
                <button type="submit">Submit</button>
            </form>

        )
    }
}

export default InitialApp;
