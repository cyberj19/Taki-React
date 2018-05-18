import React from 'react';
import {render} from 'react-dom';
import "./styles/pyro.css";
import "./styles/style.css";

import Router from "./router";
import AppProvider from "./providers/appProvider";

const component = (<AppProvider>
    <Router/>
</AppProvider>);

/* Directly adding react element */
render(
    component,
    document.getElementById("root")
);
