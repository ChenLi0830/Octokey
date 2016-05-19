/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * Universal AppLoading component. Called by components that require subscription
 * from Meteor server, such as "Catalog" or "App".
 *******************************************************************************/
import React from "react";
import {RefreshIndicator,Paper} from "material-ui";
import {Grid,Row,Col} from "react-bootstrap";

var AppLoading = React.createClass({
  render() {
    return <div>
            <Paper zDepth={1}
                   style={{backgroundColor:ZenColor.white, boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)", padding:0, borderRadius:"5px"}}>
              <div className="horizontal-center" style={{width:"40px", padding:"40px"}}>
                <RefreshIndicator size={40} left={0} top={5}
                                  style={{position:"relative"}}
                                  loadingColor={ZenColor.orange}
                                  status="loading"/>
              </div>
            </Paper>
          </div>

  }
});
//Todo change logo-zenid.svg

module.exports = AppLoading;
