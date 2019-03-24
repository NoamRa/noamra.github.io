import React, { Component } from "react";
import "./Main.css"

import Menu from "../Common/Menu";
import Content from "./Content";
import pages from "../../Conf/pages";

class Main extends Component {
  onMenuClick = (): void => {

  };

  render() {
    return (
      <div className="everything">
        <span className="nav-menu">
          <Menu
            pages={pages}
            onMenuClick={this.onMenuClick}
          />
        </span>

        <span className="content">
          <Content 
            pages={pages}
          />
        </span>
      </div>
    )
  }
}

export default Main