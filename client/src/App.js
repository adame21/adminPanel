import React from "react";
import Login from "./components/Login";
import Home from "./components/Home";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "login"
    };

    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    this.setState({
      page: page
    });
  }

  renderLogin() {
    return (
      <div className="App">
        <Login changePage={this.changePage} />
      </div>
    );
  }

  renderHome() {
    return (
      <div className="App">
        <Home changePage={this.changePage} />
      </div>
    );
  }

  render() {
    switch (this.state.page) {
      case "login":
        return this.renderLogin();
      case "home":
        return this.renderHome();
      default:
        return this.renderLogin();
    }
  }
}

export default App;
