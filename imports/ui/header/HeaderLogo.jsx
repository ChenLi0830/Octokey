/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-5-11
 *
 * Header Logo component, called by "Header" component
 *******************************************************************************/
import React from "react";
import {Link} from "react-router";
import _ from "lodash";
import {colors as Colors} from "material-ui/styles";

const styles = {
  logoImage:{
    height: 40,
    verticalAlign:"top",
    color:Colors.grey800,
    transitionDuration:"0.5s",
  }
};

var HeaderLogo = React.createClass({
  propTypes: {
    divStyle: React.PropTypes.object,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      loaded:false
    }
  },

  render(){
    messages = this.context.intl.messages.header;
    const logo = (
        <Link to="/">
          <div style={_.extend({},{margin:"10px 10px 10px 30px"},this.props.divStyle)}>
            <img src="/img/logo.png"
                 style={_.extend({}, styles.logoImage, {opacity:this.state.loaded?1:0})}
                 onLoad={()=>{this.setState({loaded:true})}}/>
            <div src="vertical-center"
                 style={{display:"inline-block",marginLeft:12, color:Colors.grey700}}>
              <h3>Octokey</h3>
              <p>O钥匙</p>
            </div>
          </div>
        </Link>
    );

    //console.log("account", account);
    return (logo)
  },
});

module.exports = HeaderLogo;