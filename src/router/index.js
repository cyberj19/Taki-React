import React, { Component } from 'react';
import routes from "../routes";
import Connect from "../providers/connect";
import {setRoute} from './actions/routerActions';


const DEFAULT_ROUTE = 'main';

class Router extends Component {
    componentWillMount() {
        setRoute(DEFAULT_ROUTE);
    }
    getRouter() {
        return routes[this.props.route];
    }
    render() {
        return this.getRouter();
    }
}

const mapStateToProps = state => {
    const {route} = state.router;
    return {
        route
    }
};

export default Connect(mapStateToProps, Router);