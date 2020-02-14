import React from "react";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "admin",
      password: "admin"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    try {
      var res = await fetch("http://localhost:3005/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: this.state.userName,
          password: this.state.password
        })
      });
      var data = await res.json();
      this.props.changePage(data.page);
    } catch (err) {
      console.log("err: " + err.message);
    }
  }

  handleReset() {
    this.setState({
      userName: "",
      password: ""
    });
  }

  render() {
    return (
      <div>
        <h1 className="text-primary">Login</h1>

        <label>Username:</label>
        <input
          type="text"
          value={this.state.userName}
          onChange={this.handleChange}
          name="userName"
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          name="password"
        />
        <br />
        <button className="btn-primary" onClick={this.handleSubmit}>
          Login
        </button>
        <button className="btn-secondary" onClick={this.handleReset}>
          Reset
        </button>
      </div>
    );
  }
}

export default Login;
