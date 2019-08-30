import React, { Component } from 'react';
import './css/global.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import config from './config';

// import components
import CourseDetail from './Components/CourseDetail';
import Courses from './Components/Courses';
import CreateCourse from './Components/CreateCourse';
import Forbidden from './Components/Forbidden';
import Header from './Components/Header';
import NotFound from './Components/NotFound';
import UnhandledError from './Components/UnhandledError';
import UpdateCourse from './Components/UpdateCourse';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import UserSignUp from './Components/UserSignUp';

import { Provider } from './Context';
import PrivateRoute from './PrivateRoute';
import withContext from './Context';

const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);

export default class App extends Component {

  state = {
    baseURL: config.apiBaseURL,
  };

  render() {
    return (
      <Provider>
        <BrowserRouter>
          <div>
            <HeaderWithContext />
              <Switch>
                <Redirect exact from='/' to='/courses' />
                <Route exact path='/courses' render={ () => <Courses baseURL={this.state.baseURL} /> } />
                // two private routes that are only displayed when authenticated
                <PrivateRoute path='/courses/create' component={CreateCourseWithContext} baseURL={this.state.baseURL} />
                <PrivateRoute exact path='/courses/:id/update' component={UpdateCourseWithContext} />
                <Route path='/courses/:id' render= { props => <CourseDetailWithContext {...props} baseURL={this.state.baseURL} />} />
                <Route path='/signin' component={UserSignInWithContext} />
                <Route path='/signup' component={UserSignUpWithContext} />
                <Route path='/signout' component={UserSignOutWithContext} />
                <Route path='/error' component={UnhandledError} />
                <Route path='/forbidden' component={ Forbidden } />
                <Route component={ NotFound } />
              </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
