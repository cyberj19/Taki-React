import React from 'react';
import {render} from 'react-dom';
import "./styles/pyro.css";
import "./styles/style.css";

import Router from "./router";
import AppProvider from "./providers/appProvider";


/* Directly adding react element */
render(
    <AppProvider>
        <Router/>
    </AppProvider>,
    document.getElementById("root")
);
