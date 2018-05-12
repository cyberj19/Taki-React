import React from 'react';
import AppContext from './context';

const Connect = (getter ,component) => <AppContext.Consumer>
    {context => {
        return <component {...getter(context)}/>
    }}
</AppContext.Consumer>;


export default Connect;
