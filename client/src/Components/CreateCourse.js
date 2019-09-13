import React, { Component } from 'react';
import { withRouter } from 'react-router';
import config from '../config';

class CreateCourse extends Component {
  state = {
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    errors: [],
  };

  // Go back to courses
  backToList = (e) => {
    e.preventDefault();
    this.props.history.push("/");
  }

  // sets course title state
  updateCourseTitle = (e) => {
    this.setState({ title: e.target.value });
  }

  // sets course description state
  updateCourseDescription = (e) => {
    this.setState({ description: e.target.value });
  }

  // sets course estimated time state
  updateCourseEstimatedTime = (e) => {
    this.setState({ estimatedTime: e.target.value });
  }

  // sets course materials state
  updateCourseMaterialsNeeded = (e) => {
    this.setState({ materialsNeeded: e.target.value });
  }

  // handle submit function
  handleSubmit = async (e) => {
    e.preventDefault();
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const userId = authUser.id;
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
    } = this.state;
    const credentials = btoa(`${authUser.emailAddress}:${authUser.password}`);
    const response = await fetch(`${config.apiBaseURL}/courses`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({
        title,
        description,
        estimatedTime,
        materialsNeeded,
        userId
      }),
    });
    if(response.status === 201) {
      this.props.history.push("/");
    } else if(response.status === 400) {
      const data = await response.json();
      this.setState({ errors: data.message.split(",") });
    } else if(response.status === 500) {
      this.props.history.push("/error");
    }
  }

  render() {
    let id = 1;
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          {
            (this.state.errors.length > 0) &&
            <div>
              <h2 className="validation--errors--label">Validation errors</h2>
              <div className="validation-errors">
                <ul>
                  {
                    (this.state.errors.map(error => {
                      return (<li key={id++}>{error}</li>);
                    }))
                  }
                </ul>
              </div>
            </div>
          }
          <form onSubmit={this.handleSubmit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input id="title" name="title" type="text"
                    className="input-title course--title--input"
                    placeholder="Course title..." value={this.state.title}
                    onChange={this.updateCourseTitle}/>
                </div>
                <p>By {authUser.firstName} {authUser.lastName}</p>
              </div>
              <div className="course--description">
                <div>
                  <textarea id="description" name="description" className=""
                    placeholder="Course description..." value={this.state.description}
                    onChange={this.updateCourseDescription}></textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input id="estimatedTime" name="estimatedTime" type="text"
                        className="course--time--input" placeholder="Hours"
                        value={this.state.estimatedTime} onChange={this.updateCourseEstimatedTime} />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea id="materialsNeeded" name="materialsNeeded"
                        className="" placeholder="List materials..."
                        value={this.state.materialsNeeded}
                        onChange={this.updateCourseMaterialsNeeded}></textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">Create Course</button>
              <button className="button button-secondary" onClick={this.backToList}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateCourse);
