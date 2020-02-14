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
      editMode: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.discardChanges = this.discardChanges.bind(this);
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

    var agenciesRes = await fetch("http://localhost:3005/select/agencies", {
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
      packageId: packageId,
      subscription: subscription,
      editObj: {
        agencyName: name,
        website: website,
        phone: phone,
        packageId: packageId,
        subscription: subscription,
        id: id
      },
      editMode: true
    });
  }

  async saveChanges() {
    console.log(this.state.editObj);
    this.setState({
      editObj: {
        agencyName: this.state.agencyName,
        website: this.state.website,
        phone: this.state.phone,
        package: this.state.package,
        subscription: this.state.subscription
      }
    });
    console.log(this.state.editObj);
    var res = await fetch("http://localhost:3005/update/agencies", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.editObj)
    });
    var data = await res.json;
    console.log(this.state.editObj);
  }

  discardChanges() {}

  validateState(obj) {
    if (
      obj.agencyName &&
      obj.website &&
      obj.phone &&
      obj.package &&
      obj.subscription
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleReset() {
    debugger;
    this.setState({
      agencyName: "",
      website: "",
      phone: "",
      package: "",
      subscription: new Date()
    });
    debugger;
  }

  handleReturn() {
    debugger;
    this.setState({
      page: "default"
    });
    debugger;
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

  renderButtons() {
    if (this.state.editMode) {
      return (
        <div>
          <button className="btn btn-success" onClick={this.saveChanges}>
            Save
          </button>
          <button className="btn btn-warning" onClick={this.discardChanges}>
            Cancel
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button className="btn btn-primary" onClick={this.handleSubmit}>
            Add
          </button>
          <button className="btn btn-secondary" onClick={this.handleReset}>
            Reset
          </button>
        </div>
      );
    }
  }

  render() {
    if (this.state.page == "added") {
      return this.renderAdded();
    }

    return (
      <div>
        <button
          className="btn btn-warning"
          onClick={() => this.props.changePage("default")}
        >
          Return
        </button>
        <h1 className="text-primary">Agencies Panel</h1>

        <label>Add agency</label>
        <br />
        <label>Agency name</label>
        <input
          type="text"
          name="agencyName"
          value={this.state.agencyName}
          onChange={this.handleChange}
        />
        <br />
        <br />
        <label>Website</label>
        <input
          type="text"
          name="website"
          value={this.state.website}
          onChange={this.handleChange}
        />
        <br />
        <br />
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={this.state.phone}
          onChange={this.handleChange}
        />
        <br />
        <br />

        <label>Package</label>
        <br />
        <select
          name="package"
          id="package"
          onChange={this.handleChange}
          defaultValue={this.state.packages[0]}
        >
          {this.state.packages.map((onePack, i) => (
            <option key={onePack.id} id={onePack.id} value={onePack.id}>
              {onePack.id}
              {onePack.name} - {onePack.no_of_agents} agents -{" "}
              {onePack.no_of_documents} documents
            </option>
          ))}
        </select>
        <br />
        <br />

        <label>Subscription</label>

        <input
          type="date"
          name="subscription"
          value={this.state.subscription}
          onChange={this.handleChange}
        />
        <br />
        <br />
        {this.renderButtons()}

        <br />
        <br />
        <br />
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
                      className="btn btn-danger"
                      onClick={this.handleDelete}
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-warning"
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
    );
  }
}

export default Agencies;
