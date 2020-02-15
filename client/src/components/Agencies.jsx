import React from "react";

class Agencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      agencies: [],
      agencyName: "",
      website: "",
      phone: "",
      package: 0,
      subscription: this.getTime(),
      page: "default",
      editObj: {},
      editMode: false,
      addAgencyFormVisible:false,
      searchAgencyFormVisible:false,
      searchAgencyName: "",
      searchPhone: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
    this.changeAddAgencyFormVisibility = this.changeAddAgencyFormVisibility.bind(this);
    this.changeSearchAgencyFormVisibility=this.changeSearchAgencyFormVisibility.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchReset = this.handleSearchReset.bind(this);
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
    var packagesRes = await fetch("http://localhost:3005/select/packages", {
      method: "get"
    });
    var packages = await packagesRes.json();

    var agenciesRes = await fetch("http://localhost:3005/select/agencies/all", {
      method: "get"
    });
    var agencies = await agenciesRes.json();

    this.setState({
      packages: packages,
      agencies: agencies,
      package: packages[0] ? packages[0].id : 0
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  changeAddAgencyFormVisibility(){
    this.setState({addAgencyFormVisible: !this.state.addAgencyFormVisible})
  }
  changeSearchAgencyFormVisibility(){
    this.setState({searchAgencyFormVisible: !this.state.searchAgencyFormVisible})

  }
  async handleSearch() {
    var searchRes = await fetch(
      `http://localhost:3005/select/agencies?searchName=${this.state.searchAgencyName}&searchPhone=${this.state.searchPhone}`
    );
    var searchData = await searchRes.json();

    this.setState({
      agencies: searchData
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.validateState(this.state)) {
      try {
        var res = await fetch("http://localhost:3005/add/agencies", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        });
        var data = await res.json();
        this.setState({
          page: "added"
        });
        this.handleReset();
        this.loadArrays();
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

      var res = await fetch("http://localhost:3005/delete/agencies", {
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
    this.setState({addAgencyFormVisible: true})
    let id = event.target.parentElement.parentElement.childNodes[0].innerHTML;
    let name = event.target.parentElement.parentElement.childNodes[1].innerHTML;
    let website =
      event.target.parentElement.parentElement.childNodes[2].innerHTML;
    let phone =
      event.target.parentElement.parentElement.childNodes[3].innerHTML;
    let packageId =
      event.target.parentElement.parentElement.childNodes[4].innerHTML;
    let subscription =
      event.target.parentElement.parentElement.childNodes[5].innerHTML;

    this.setState({
      agencyName: name,
      website: website,
      phone: phone,
      package: packageId,
      subscription: subscription,
      editObj: Object.assign(this.state.editObj, {
        agencyName: name,
        website: website,
        phone: phone,
        packageId: packageId,
        subscription: subscription,
        id: id
      }),
      editMode: true
    });
  }

  async saveChanges() {
    this.setState({addAgencyFormVisible: false})
    debugger;
    this.setState({
      editObj: Object.assign(this.state.editObj, {
        agencyName: this.state.agencyName,
        website: this.state.website,
        phone: this.state.phone,
        package: this.state.package,
        subscription: this.state.subscription
      })
    });
    debugger;
    var res = await fetch("http://localhost:3005/update/agencies", {
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
    this.setState({addAgencyFormVisible: false})

    this.handleReset();
    this.setState({
      editMode: false
    });
  }

  validateState(obj) {
    if (
      obj.agencyName &&
      obj.website &&
      obj.phone &&
      // obj.package &&
      obj.subscription
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleReset() {
    this.setState({
      agencyName: "",
      website: "",
      phone: "",
      subscription: this.getTime()
    });
  }

  handleSearchReset() {
    this.setState({
      searchAgencyName: "",
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
        <button className="btn btn-primary" onClick={this.handleReturn}>
        <i class="fas fa-arrow-circle-left"></i> Return
          
        </button>
      </div>
    );
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
          <button id="blue-btn" className="btn btn-primary btn-form" onClick={this.handleSubmit}>
            Add
          </button>
          <button className="btn btn-secondary btn-form" onClick={this.handleReset}>
            Reset
          </button>
        </div>
      );
    }
  }
  renderAddAgencyForm(){
return (
  <div className="form-container">
  <form>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Agency name</label>
            <div class="col-sm-8">
              <input type="text" 
              class="form-control" 
              name="agencyName"
              value={this.state.agencyName}
              onChange={this.handleChange}/>
            </div>
          </div>

  <div class="form-group row">
    <label class="col-sm-2 col-form-label">Website</label>
    <div class="col-sm-8">
      <input type="text" 
      class="form-control" 
      name="website"
      value={this.state.website}
      onChange={this.handleChange}/>
    </div>
  </div>

  <div class="form-group row">
    <label class="col-sm-2 col-form-label">Phone</label>
    <div class="col-sm-8">
      <input type="text" class="form-control" 
         name="phone"
         value={this.state.phone}
         onChange={this.handleChange}/>
    </div>
  </div>
  <div class="form-group row">
      <label class="col-sm-2 col-form-label">Package</label>
      <div class="col-sm-8">
         <select class="form-control"
          name="package"
          id="package"
          onChange={this.handleChange}
          defaultValue={this.state.packages[0]}>
          <option selected>Choose</option>
          {this.state.packages.map((onePack, i) => (
            <option key={onePack.id} id={onePack.id} value={onePack.id}>
              {onePack.id}
              {onePack.name} - {onePack.no_of_agents} agents -{" "}
              {onePack.no_of_documents} documents
            </option>
          ))}
        </select>
      </div>
     
    </div>
  <div class="form-group row">
    <label class="col-sm-2 col-form-label">Subscription</label>
    <div class="col-sm-8">
      <input type="text" class="form-control" placeholder=""/>
    </div>
  </div>
</form>
<div>
        {this.renderButtons()}

        </div>
</div>
)
  }

  renderSearchAgencyForm(){
    return (
      <div className="form-container">
      <form>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Agency name</label>
                <div class="col-sm-8">
                <input
                className="form-control"
                type="text"
                name="searchAgencyName"
                value={this.state.searchAgencyName}
                onChange={this.handleChange}
              />
                </div>
              </div> 
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Phone</label>
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
      
      
    </form>
    <div>
            {this.renderSearchButtons()}
    
            </div>
    </div>
    )
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
        <h1 id="agencies-title">Agencies Panel</h1>
        <div id="btn-container">
        <button id={this.state.addAgencyFormVisible? "white-btn":"blue-btn" }
        className="btn expend-btn" 
        onClick={this.changeAddAgencyFormVisibility}>
          {this.state.addAgencyFormVisible? 
           <i class="fas fa-chevron-down chevron"></i> :
          <i class="fas fa-chevron-right chevron"></i>  }
         Add agency
          </button>
        </div>

       
    {this.state.addAgencyFormVisible? this.renderAddAgencyForm() : null}
    <div id="btn-container">
        <button id={this.state.searchAgencyFormVisible? "white-btn":"blue-btn" }
        className="btn expend-btn" 
        onClick={this.changeSearchAgencyFormVisibility}>
          {this.state.searchAgencyFormVisible? 
           <i class="fas fa-chevron-down chevron"></i> :
          <i class="fas fa-chevron-right chevron"></i>  }
         Search agency
          </button>
        </div>
        {this.state.searchAgencyFormVisible? this.renderSearchAgencyForm() : null}
        <br />
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
                  Website
                </th>
                <th scope="col" key="4">
                  Phone
                </th>
                <th scope="col" key="5">
                  Package
                </th>
                <th scope="col" key="6">
                  Subscription
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
              {this.state.agencies.map(oneAgency => {
                return (
                  <tr key={oneAgency.id}>
                    <th scope="row" key={oneAgency.id}>
                      {oneAgency.id}
                    </th>
                    <td>{oneAgency.name}</td>
                    <td>{oneAgency.web_site}</td>
                    <td>{oneAgency.phone}</td>
                    <td>{oneAgency.package_id}</td>
                    <td>{oneAgency.subscription_end_date.substring(0, 10)}</td>
                    <td>{oneAgency.created_at.substring(0, 10)}</td>
                    <td>{oneAgency.updated_at.substring(0, 10)}</td>
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

export default Agencies;
