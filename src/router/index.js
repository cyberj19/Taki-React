import React, { Component } from 'react';
import routes from "../routes";
import Connect from "../providers/connect";

const DEFAULT_ROUTE = 'main';

class Router extends Component {
    getRouter() {
        return routes[this.props.route || DEFAULT_ROUTE];
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