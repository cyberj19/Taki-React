import React from "react";
import {toTimeString} from '../modules/texts.mjs';

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { seconds: 0 };
    }
    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return toTimeString((performance.now() - this.props.startTime) / 1000);
    }
}
export default Timer;