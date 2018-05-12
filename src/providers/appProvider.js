import React, {Component} from 'react';
import {AppContext} from './context';

class AppProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            app: "Taki",
            __updateState: newStateGetter => this.updateState(newStateGetter)
        };

        this.updateState = this.updateState.bind(this);
    }

    updateState(newStateGetter) {
        const {__updateState, ...rest} = this.state,
            newState = newStateGetter(rest);
        newState && this.setState({...rest, ...newState, __updateState});
    }


    render() {
        return <AppContext.Provider value={this.state}>
            {this.props.children}
        </AppContext.Provider>
    }
}

export default AppProvider;
