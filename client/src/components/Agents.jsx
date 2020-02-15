import React from "react";

class Agents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agents: [],
      agencies: [],
      agency: 0,
      agencyName: "",
      agentName: "",
      cellular: "",
      password: "",
      license: "",
      agent: 0,
      page: "default",
      editObj: {},
      editMode: false,
      searchAgencyName: "",
      searchAgency: "none",
      searchAgentName: "",
      searchPhone: "",
      addAgentFormVisible:false,
      searchAgentFormVisible:false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchReset = this.handleSearchReset.bind(this);
    this.changeAddAgentFormVisibility = this.changeAddAgentFormVisibility.bind(this);
    this.changeSearchAgentFormVisibility=this.changeSearchAgentFormVisibility.bind(this);
  }

  getTime() {
    var newDate = new Date().toLocaleDateString();

    var formattedDate = `${newDate.slice(5)}-${
      newDate.slice(0, 1).length == 1
        ? "0" + newDate.slice(0, 1)
        : newDate.slice(0, 1)
    }-${
      newDate.slice(2, 4).length == 1
        ? "0" + newDate.slice(2, 4)
        : newDate.slice(2, 4)
    }`;
    return formattedDate;
  }

  async componentDidMount() {
    this.loadArrays();
  }

  async loadArrays() {
    var agentsRes = await fetch("http://localhost:3005/select/agents/all", {
      method: "get"
    });
    var agents = await agentsRes.json();

    var agenciesRes = await fetch("http://localhost:3005/select/agencies/all", {
      method: "get"
    });
    var agencies = await agenciesRes.json();

    this.setState({
      agents: agents,
      agencies: agencies,
      agent: agents[0] ? agents[0].id : 0,
      agency: agencies[0] ? agencies[0].id : 0
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  changeAddAgentFormVisibility(){
    this.setState({addAgentFormVisible: !this.state.addAgentFormVisible})
  }
  changeSearchAgentFormVisibility(){
    this.setState({searchAgentFormVisible: !this.state.searchAgentFormVisible})

  }
  async handleSearch() {
    var searchRes = await fetch(
      `http://localhost:3005/select/agents?searchName=${this.state.searchAgentName}&searchPhone=${this.state.searchPhone}&searchAgency=${this.state.searchAgency}`
    );
    var searchData = await searchRes.json();

    this.setState({
      agents: searchData
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.validateState(this.state)) {
      try {
        var res = await fetch("http://localhost:3005/add/agents", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        });
        var data = await res.json();

        debugger;
        if (data.status) {
          this.setState({
            page: "added"
          });
          this.handleReset();
          this.loadArrays();
        } else {
          alert(
            `Agent was NOT added, current agents in agency: ${data.currentAgents}, Limit: ${data.limitForAgency}`
          );
        }
      } catch (err) {
        console.log("err: " + err.message, "stack: " + err.stack);
      }
    } else {
      alert("missing input");
    }
  }

  async handleDelete(event) {
    var confAnswer = window.confirm("Are you sure you want to delete?");

    if (confAnswer) {
      var deletionId =
        event.target.parentElement.parentElement.firstElementChild.innerHTML;
      var res = await fetch("http://localhost:3005/delete/agents", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: deletionId
        })
      });
      var deleteRes = await res.json();
      this.loadArrays();
      console.log(deleteRes);
    } else {
      console.log("no delete");
    }
  }

  handleEdit(event) {
    this.setState({addAgentFormVisible: true})
    let id = event.target.parentElement.parentElement.childNodes[0].innerHTML;
    let name = event.target.parentElement.parentElement.childNodes[1].innerHTML;
    let cellular =
      event.target.parentElement.parentElement.childNodes[2].innerHTML;
    let password =
      event.target.parentElement.parentElement.childNodes[3].innerHTML;
    let agency =
      event.target.parentElement.parentElement.childNodes[4].innerHTML;
    let license =
      event.target.parentElement.parentElement.childNodes[5].innerHTML;

    this.setState({
      agentName: name,
      cellular: cellular,
      password: password,
      agency: agency,
      license: license,
      editObj: Object.assign(this.state.editObj, {
        agencyName: name,
        cellular: cellular,
        password: password,
        agency: agency,
        license: license,
        id: id
      }),
      editMode: true
    });
  }

  async saveChanges() {
    this.setState({addAgentFormVisible: false})
    this.setState({
      editObj: Object.assign(this.state.editObj, {
        agentName: this.state.agentName,
        cellular: this.state.cellular,
        password: this.state.password,
        agency: this.state.agency,
        license: this.state.license
      })
    });

    var res = await fetch("http://localhost:3005/update/agents", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.editObj)
    });
    var data = await res.json;
    this.handleReset();
    this.loadArrays();
    this.setState({ editMode: false });
  }

  discardChanges() {
    this.setState({addAgentFormVisible: false})
    this.handleReset();
    this.setState({
      editMode: false
    });
  }

  validateState(obj) {
    if (
      obj.agentName &&
      obj.cellular &&
      obj.password &&
      obj.agency &&
      !isNaN(obj.license)
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleReset() {
    this.setState({
      agentName: "",
      cellular: "",
      password: "",
      license: ""
    });
  }

  handleSearchReset() {
    this.setState({
      searchAgencyName: "",
      searchAgentName: "",
      searchPhone: ""
    });
  }

  handleReturn() {
    this.setState({
      page: "default"
    });
  }

  renderAdded() {
    return (
      <div>
        <h1>Added successfuly!</h1>
        <br />
        <button className="btn btn-info" onClick={this.handleReturn}>
          Return
        </button>
      </div>
    );
  }
  renderAddAgentForm(){
    return (
      <div className="form-container">
      <form>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Agent Name</label>
                <div class="col-sm-8">
                <input
                className="form-control"
                type="text"
                name="agencyName"
                value={this.state.agencyName}
                  onChange={this.handleChange}/>
              
                  
                </div>
              </div>
    
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Cellular</label>
        <div class="col-sm-8">
        <input
                className="form-control"
                type="text"
                name="cellular"
                value={this.state.cellular}
                onChange={this.handleChange}
              />
        </div>
      </div>
    
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm-8">
        <input
                className="form-control"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
        </div>
      </div>
      <div class="form-group row">
          <label class="col-sm-2 col-form-label">Agency</label>
          <div class="col-sm-8">
          <select
                className="form-control"
                name="searchAgency"
                id="searchAgency"
                onChange={this.handleChange}
                value={this.state.searchAgency}
              >
                {this.state.agencies.map((oneAgency, i) => (
                  <option
                    key={oneAgency.id}
                    id={oneAgency.id}
                    value={oneAgency.id}
                  >
                    {oneAgency.id} - {oneAgency.name} - {oneAgency.phone}
                  </option>
                ))}
                <option key={"none"} id={"none"} value={"none"}>
                  None
                </option>
              </select>
          </div>
         
        </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">License</label>
        <div class="col-sm-8">
        <input
                className="form-control"
                type="text"
                name="license"
                value={this.state.license}
                onChange={this.handleChange}
              />
        </div>
      </div>
    </form>
    <div>
            {this.renderButtons()}
    
            </div>
    </div>
    )
      }

      renderSearchAgentForm(){
        return (
          <div className="form-container">
          <form>
                  <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Agent Name</label>
                    <div class="col-sm-8">
                    <input
                className="form-control"
                type="text"
                name="searchAgentName"
                value={this.state.searchAgentName}
                onChange={this.handleChange}
              />
                      
                    </div>
                  </div>
        
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Cellular</label>
            <div class="col-sm-8">
            <input
                className="form-control"
                type="text"
                name="searchPhone"
                value={this.state.searchPhone}
                onChange={this.handleChange}
              />
            </div>
          </div>
        
          <div class="form-group row">
              <label class="col-sm-2 col-form-label">Agency</label>
              <div class="col-sm-8">
              <select
                className="form-control"
                name="searchAgency"
                id="searchAgency"
                onChange={this.handleChange}
                value={this.state.searchAgency}
              >
                {this.state.agencies.map((oneAgency, i) => (
                  <option
                    key={oneAgency.id}
                    id={oneAgency.id}
                    value={oneAgency.id}
                  >
                    {oneAgency.id} - {oneAgency.name} - {oneAgency.phone}
                  </option>
                ))}
                <option key={"none"} id={"none"} value={"none"}>
                  None
                </option>
              </select>
              </div>
             
            </div>
          
        </form>
        <div>
                {this.renderSearchButtons()}
                </div>
        </div>
        )
          }

  renderButtons() {
    if (this.state.editMode) {
      return (
        <div>
          <button className="btn btn-success btn-form" onClick={this.saveChanges}>
            Save
          </button>
          <button className="btn btn-warning btn-form" onClick={this.discardChanges}>
            Cancel
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button className="btn btn-primary btn-form" onClick={this.handleSubmit}>
            Add
          </button>
          <button className="btn btn-secondary btn-form" onClick={this.handleReset}>
            Reset
          </button>
        </div>
      );
    }
  }
  renderSearchButtons() {
    return (
      <div>
        <button className="btn btn-primary btn-form" onClick={this.handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary btn-form" onClick={this.handleSearchReset}>
          Reset Search
        </button>
      </div>
    );
  }

  render() {
    if (this.state.page == "added") {
      return this.renderAdded();
    }

    return (
      <React.Fragment>
          <button
          className="return-btn"
          onClick={() => this.props.changePage("default")}
        >
          <i class="fas fa-arrow-circle-left"></i>
        </button>
        <h1 id="agencies-title">Agents Panel</h1>
        <div id="btn-container">
        <button id={this.state.addAgentFormVisible? "white-btn":"blue-btn" }
        className="btn expend-btn" 
        onClick={this.changeAddAgentFormVisibility}>
          {this.state.addAgentFormVisible? 
           <i class="fas fa-chevron-down chevron"></i> :
          <i class="fas fa-chevron-right chevron"></i>  }
         Add agent
          </button>
        </div>
        {this.state.addAgentFormVisible? this.renderAddAgentForm() : null}

        <div id="btn-container">
        <button id={this.state.searchAgentFormVisible? "white-btn":"blue-btn" }
        className="btn expend-btn" 
        onClick={this.changeSearchAgentFormVisibility}>
          {this.state.searchAgentFormVisible? 
           <i class="fas fa-chevron-down chevron"></i> :
          <i class="fas fa-chevron-right chevron"></i>  }
         Search agent
          </button>
        </div>
        {this.state.searchAgentFormVisible? this.renderSearchAgentForm() : null}
<br></br>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col" key="1">
                  #
                </th>
                <th scope="col" key="2">
                  Name
                </th>
                <th scope="col" key="3">
                  Cellular
                </th>
                <th scope="col" key="4">
                  Password
                </th>
                <th scope="col" key="5">
                  Agency
                </th>
                <th scope="col" key="6">
                  License
                </th>
                <th scope="col" key="7">
                  Last Created
                </th>
                <th scope="col" key="8">
                  Last Updated
                </th>
                <th scope="col" key="9">
                  Controls
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.agents.map(oneAgent => {
                return (
                  <tr key={oneAgent.id}>
                    <th scope="row" key={oneAgent.id}>
                      {oneAgent.id}
                    </th>
                    <td>{oneAgent.name}</td>
                    <td>{oneAgent.cellular}</td>
                    <td>{oneAgent.password}</td>
                    <td>{oneAgent.agency_id}</td>
                    <td>{oneAgent.license_id}</td>
                    <td>{oneAgent.created_at.substring(0, 10)}</td>
                    <td>{oneAgent.updated_at.substring(0, 10)}</td>
                    <td>
                      {" "}
                      <button
                        className="btn btn-danger btn-table"
                        onClick={this.handleDelete}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-warning btn-table"
                        onClick={this.handleEdit}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Agents;
