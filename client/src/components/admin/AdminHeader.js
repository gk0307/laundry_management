import React, { Component } from "react";
import { Link , withRouter } from "react-router-dom";

 class AdminHeader extends Component {
  constructor()
  {
    super();
    this.state ={
      active:"Dashboard"
    }

  }
  render() {

   const logout = () =>
    {
      localStorage.removeItem('admin_token');
      this.props.history.push('/login');

    }
    return (
      <>
      <div className="top-nav-wrapper">
        <div className="top-nav">
          <div className="hamburger-menu">
            <div className="hamburger-icon">
              <div className="bar-one"></div>
              <div className="bar-two"></div>
              <div className="bar-three"></div>
            </div>
          </div>
          <div className="logo">CLEAN THUNI</div>
          <div className="search">
            <button className="material-icons not-active-icon search-btn bg-dark" onClick={()=> logout()}>
              logout 
            </button>
          </div>  
        </div>
      </div>
    {/* <div className="mobile-nav">
    <div className="mobile-dashboard-link">Dashboard</div>
    <div className="mobile-dashboard-link">Bookings</div>
    <div className="mobile-dashboard-link">Services</div>
    <div className="mobile-dashboard-link">ervice Units</div>
    </div> */}
    </>
    );
  }
}


export default  withRouter(AdminHeader);