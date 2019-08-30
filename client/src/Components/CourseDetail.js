import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import ReactMarkdown from 'react-markdown';
import config from '../config';
import axios from 'axios';

class CourseDetail extends Component {
  _isMounted = false;

  state = {
    course: '',
    isLoading: true,
  };

  componentDidMount() {
    this.handleCourse();
  }

  //course handler
  handleCourse = () => {
    // axios seems superior to fetch for get routes as it simplifies JSON handling
    axios.get(`${this.props.baseURL}/courses/${this.props.match.params.id}`)
      .then(res => {
        const courseInfo = res.data;
        this.setState({
          course: courseInfo.courses,
          isLoading: false
        });
      }).catch(error => {
        if(error.status === 404) {
          this.props.history.push("/notFound");
        }
      })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // delete handler
  handleDelete = async (e) => {
    e.preventDefault();
    const { context } = this.props;
    let password = prompt("Please enter your password");
    const authUser = context.authenticatedUser;
    // used axios here to ensure that I know how to do an axios post as well as get
    axios.delete(`${config.apiBaseURL}/courses/${this.state.course.id}`, {
      method: 'DELETE',
      auth: {
        username: `${authUser.emailAddress}`,
        password: password
      },
      data: {
        id: this.state.id
      }
    }).then(response => {
        if(response.status === 401) {
          this.props.history.push("/forbidden");
        } else {
          this.props.history.push("/");
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push("/error");
      });
  }


  render() {
    const { context} = this.props;
    const authUser = context.authenticatedUser;
    return (
      this.state.isLoading ? (<h2>Loading Course Information...</h2>) :
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {
                (authUser && authUser.id === this.state.course.User.id) &&
                <span>
                  <Link to={`/courses/${this.state.course.id}/update`}
                    className="button">Update Course</Link>
                  <Link to="/" className="button"
                    onClick={this.handleDelete}>Delete Course</Link>
                </span>
              }
              <Link to="/" className="button button-secondary">Return to List</Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{this.state.course.title}</h3>
              <p>By {this.state.course.User.firstName} {this.state.course.User.lastName}</p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={this.state.course.description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{this.state.course.estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    <ReactMarkdown source={this.state.course.materialsNeeded} />
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CourseDetail);
