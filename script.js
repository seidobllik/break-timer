const DEFAULT_SETTINGS = {
  sessionTime: 1500,
  breakTime: 300,
  timeLeft: 1500,
  active: false,
  onBreak: false,
  intervalID: null 
};


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_SETTINGS;
    this.handleTimer = this.handleTimer.bind(this);
    this.countdown = this.countdown.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
    this.reset = this.reset.bind(this);
    this.getFormattedTime = this.getFormattedTime.bind(this);
    this.changeLength = this.changeLength.bind(this);
  }

  handleTimer() {
    let active = this.state.active;
    let intervalID = this.state.intervalID;
    active = !active;

    if (active) {
      intervalID = setInterval(this.countdown, 1000);
    } else {
      clearInterval(intervalID);
    }
    this.setState({
      active: active,
      intervalID: intervalID }
    );
  }

  countdown() {
    let timeLeft = this.state.timeLeft - 1;
    if (timeLeft < 0) {
      this.handleTimeout();
      return;
    } else {
      $("#time-left").effect("bounce", { times: 1 }, 250);
      this.setState({
        timeLeft: timeLeft 
      });
    }
  }

  handleTimeout() {
    let onBreak = this.state.onBreak;
    let newTime = null;
    let audio = document.getElementById("beep");
    onBreak = !onBreak;
    if (onBreak) {
      newTime = this.state.breakTime;
    } else {
      newTime = this.state.sessionTime;
    }
    audio.currentTime = 0;
    audio.play();
    this.setState({
      timeLeft: newTime,
      onBreak: onBreak 
    });
  }

  reset() {
    let audio = document.getElementById("beep");
    let intervalID = this.state.intervalID;
    audio.pause();
    audio.currentTime = 0;
    clearInterval(intervalID);
    this.setState(DEFAULT_SETTINGS);
  }

  getFormattedTime() {
    // return a string in the format MM:SS.
    let time = this.state.timeLeft;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return "" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  }

  changeLength(action, target) {
    if (this.state.active) {
      return;
    }
    switch (action) {
      case "inc":
        if (target === "break") {
          let breakTime = this.state.breakTime + 60 > 3600 ? 3600 : this.state.breakTime + 60;
          this.setState({ breakTime: breakTime });
        } else if (target === "session") {
          let sessionTime = this.state.sessionTime + 60 > 3600 ? 3600 : this.state.sessionTime + 60;
          this.setState({
            sessionTime: sessionTime,
            timeLeft: sessionTime 
          });
        }
        break;

      case "dec":
        if (target === "break") {
          let breakTime = this.state.breakTime - 60 < 60 ? 60 : this.state.breakTime - 60;
          this.setState({ breakTime: breakTime });
        } else if (target === "session") {
          let sessionTime = this.state.sessionTime - 60 < 60 ? 60 : this.state.sessionTime - 60;
          this.setState({
            sessionTime: sessionTime,
            timeLeft: sessionTime 
          });
        }
        break;

      default:
        break;

    }
  }

  render() {
    let nameToDisplay = this.state.onBreak ? "Break" : "Session";
    return (
      React.createElement("div", { className: "timer" },
      React.createElement("div", { id: "main-section" },
      React.createElement("div", { className: "controls-container" },
      React.createElement("label", { id: "timer-label" }, nameToDisplay),
      React.createElement("h2", { id: "time-left" }, this.getFormattedTime()),
      React.createElement("div", { className: "controls" },
      React.createElement("button", { className: "btn btn-success", id: "start_stop", onClick: this.handleTimer }, "start/stop"),
      React.createElement("button", { className: "btn btn-danger", id: "reset", onClick: this.reset }, "reset")))),
      React.createElement("div", { id: "menu-section" },
      React.createElement("div", { className: "controls-container" },
      React.createElement("label", { id: "break-label" }, "Break Length"),
      React.createElement("div", { className: "controls" },
      React.createElement("button", { className: "btn btn-danger", id: "break-decrement", onClick: () => this.changeLength("dec", "break") }, "-"),
      React.createElement("h2", { id: "break-length" }, this.state.breakTime / 60),
      React.createElement("button", { className: "btn btn-primary", id: "break-increment", onClick: () => this.changeLength("inc", "break") }, "+"))),
      React.createElement("div", { className: "controls-container" },
      React.createElement("label", { id: "session-label" }, "Session Length"),
      React.createElement("div", { className: "controls" },
      React.createElement("button", { className: "btn btn-danger", id: "session-decrement", onClick: () => this.changeLength("dec", "session") }, "-"),
      React.createElement("h2", { id: "session-length" }, this.state.sessionTime / 60),
      React.createElement("button", { className: "btn btn-primary", id: "session-increment", onClick: () => this.changeLength("inc", "session") }, "+")))),
      React.createElement("audio", { id: "beep", src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" })));
  }
}


ReactDOM.render(React.createElement(Timer, null), document.getElementById("root"));