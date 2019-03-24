import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Button } from "antd";
import { Page } from "../../Conf/pages";

type SideMenuProps = {
  pages: Page[],
  onMenuClick: () => void,
};

const SubMenu = Menu.SubMenu;

class SideMenu extends Component<SideMenuProps> {
  state = {
    collapsed: true,
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  
  render() {
    const { pages } = this.props;

    return (
      <div style={{ width: 256 }}>
        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >
          {
            pages.map((page: Page, idx: number) => {
              return (
                page.inMenu &&
                <Menu.Item key={page.id} >
                  <Link to={page.path}>
                    <Icon type={page.icon} />
                    <span>{page.displayName}</span>
                  </Link>
                </Menu.Item>
              )
            })
          }
        </Menu>
      </div>
    );
  }
}

export default SideMenu