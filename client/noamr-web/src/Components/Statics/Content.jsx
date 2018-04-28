import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

class Content extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        {
          this.props.pages.map(page => {
            return (
              <Route 
                exact
                path={page.path}
                component={page.componentRef}
                key={page.id}
              />
            )
          })
        }
      </Switch>
    )
  }
}

export default Content