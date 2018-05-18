import React from 'react';
import AppContext from './context';

const Connect = (getter ,component, ...props) => <AppContext.Consumer>
    {context => {
        return <component {...getter(context)} {...props}/>
    }}
</AppContext.Consumer>;


export default Connect;
