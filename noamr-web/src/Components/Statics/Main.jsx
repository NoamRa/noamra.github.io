import React, { Component } from 'react';
import './Main.css'

import Menu from '../Common/Menu';
import Content from './Content';
import pages from '../../Conf/pages.js';
import { AuthProvider } from '../../Context/AuthContext';

class Main extends Component {
  // constructor(props) {
  //   super(props);
  // }

  onMenuClick = () => {

  }

  render() {
    return (
      <AuthProvider>
        <div className='everything'>
          <span className='nav-menu'>
            <Menu
              className='menu'
              pages={pages}
              onClick={this.onMenuClick}
            />
          </span>

          <span className='content'>
            <Content 
              pages={pages}
            />
          </span>
        </div>
      </AuthProvider>
    )
  }
}

export default Main