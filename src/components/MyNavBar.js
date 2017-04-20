//components/MyModal.js

/* Wrapper for react-bootstrap modal */
import React, {Component} from 'react';
import {Navbar, Nav, NavItem, /* NavDropdown, MenuItem */} from 'react-bootstrap'
import rose from '../../public/compass.png'
import './MyNavBar.css'
import MyToggle from './MyToggle'


const MODE_MAP_ON = "MAP";
const MODE_MAP_OFF = "PLOT";


class MyNavBar extends Component{

  render(){
      return (

          <MyToggle onClick={this.props.onModeToggle} value={this.props.isMapOn} active={MODE_MAP_OFF} inactive={MODE_MAP_ON}/>
         
          //<div className={"navbar-container"}>
          //  <Navbar>
          //      <Navbar.Header>
          //        <Navbar.Brand>
          //          <img src={rose} alt="" className={"App-logo"} />
          //          <a href="#">React Ocean App</a>
          //
          //        </Navbar.Brand>
          //      </Navbar.Header>
          //      <Nav>
          //        <NavItem >
          //          <MyToggle onClick={this.props.onModeToggle} value={this.props.isMapOn} active={MODE_MAP_OFF} inactive={MODE_MAP_ON}/>
          //        </NavItem>
          //
          //      </Nav>
          //
          //    </Navbar>
          //  </div> 
      );
  }
}



module.exports = MyNavBar;
