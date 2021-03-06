import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import Search from './components/users/Search'
import './App.css';
import Alert from './components/layout/Alert'
import About from './components/pages/About'
import User from './components/users/User'
import axios from 'axios';

class App extends Component {

  state = {
    users : [],
    user : {},
    loading : false,
    alert : null
  }

  async componentDidMount(){
    // this.setState({ loading : true})
    // const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    // this.setState({ users : res.data, loading : false})
  }

  searchUsers = async (text)=>{
    this.setState({ loading : true})
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    this.setState({ users : res.data.items, loading : false})
  }

  //get simgle user

  getUser = async (username)=>{
    this.setState({ loading : true})
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    this.setState({ user : res.data, loading : false})
  }

  clearUsers = ()=> this.setState({users : [],loading : false, showClear:false})

  setAlert = (msg,type)=>{
    this.setState( {alert : {
      msg,type
    }})
    setTimeout(()=>{
      this.setState({
        alert : null
      })
    },2000)
  }

  render(){ 
    const {loading, users,user} = this.state 
    return (
      <Router>
        <div className="App">
          <Navbar title="GitHub Finder" icon="fab fa-github"></Navbar>
          <div className="container">
            <Alert alert={this.state.alert}></Alert>
            <Switch>
                <Route path='/' exact render={props => (
                  <Fragment>
                      <Search setAlert={this.setAlert} clearUsers={this.clearUsers } searchUsers={this.searchUsers} showClear={users.length > 0 ? true : false} />
                      <Users loading={loading} users={users}></Users>
                  </Fragment>
                )} />
                <Route path='/about' exact component={About}/>
                <Route path='/user/:login' exact render={(props)=>(
                  <User {...props} getUser={this.getUser} user={user} loading={loading}></User>
                )}/>
            </Switch>
           
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
