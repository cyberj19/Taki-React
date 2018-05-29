import React from 'react';
import {render} from 'react-dom';
import "./styles/pyro.css";
import "./styles/style.css";

import GameManager from "./components/gameManager";

render(
    <GameManager/>,
    document.getElementById("root")
);
