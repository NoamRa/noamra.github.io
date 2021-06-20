import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Page } from "../../Conf/pages";

type ContentProps = {
  pages: Page[],
}

class Content extends Component<ContentProps> {

  render() {
    return (
      <Switch>
        {
          this.props.pages.map((page: Page) => (
            <Route 
              exact={page.exact === false ? false : true}
              path={page.path}
              component={page.componentRef}
              key={page.id}
            />
          ))
        }
      </Switch>
    )
  }
}

export default Content