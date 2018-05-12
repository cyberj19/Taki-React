import React from 'react';
import {AppContext} from './context';


const Update = (newStateGetter) => <AppContext.Consumer>
    {context =>  context.__updateState(newStateGetter)}
</AppContext.Consumer>;

export default Update;
