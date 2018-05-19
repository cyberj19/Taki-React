import React from 'react';
import {render} from 'react-dom';
import "./styles/pyro.css";
import "./styles/style.css";

import GameManager from "./components/gameManager";
/*import AppProvider from "./providers/appProvider";

const component = (<AppProvider>
    <Router/>
</AppProvider>);*/
const component = <GameManager/>;

/* Directly adding react element */
render(
    component,
    document.getElementById("root")
);
