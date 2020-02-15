import React from "react";
import Agencies from "./Agencies";
import Agents from "./Agents";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "default"
    };

    this.handleClick = this.handleClick.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  handleClick(page) {
    this.changePage(page);
  }

  changePage(page) {
    this.setState({
      page: page
    });
  }

  renderAgencies() {
    return (
      <div className="App">
        <Agencies changePage={this.changePage} />
      </div>
    );
  }

  renderAgents() {
    return (
      <div>
        <Agents changePage={this.changePage} />
      </div>
    );
  }

  render() {
    switch (this.state.page) {
      case "agencies":
        return this.renderAgencies();
      case "agents":
        return this.renderAgents();
      default:
        return (
          <div>
            <h1 className="text-primary">Home</h1>

            <label>Select:</label>
            <br />
            <button
              className="btn-primary"
              value="agencies"
              onClick={() => this.handleClick("agencies")}
            >
              Agencies
            </button>
            <button
              className="btn-primary"
              value="agents"
              onClick={() => this.handleClick("agents")}
            >
              Agents
            </button>
          </div>
        );
    }
  }
}

export default Home;
