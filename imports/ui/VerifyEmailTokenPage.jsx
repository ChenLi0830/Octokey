/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-4-4
 *
 * VerifyEmailTokenPage component. Called by routes directly, a user will get access to this
 * component when he/she clicks the link from the verification email
 *******************************************************************************/
import React from "react"
import {RefreshIndicator,Paper  } from "material-ui";
import {Grid,Row,Col} from "react-bootstrap";
import {Colors} from "material-ui/styles/colors";

var VerifyEmailTokenPage = React.createClass({

  propTypes: {
    params: React.PropTypes.object.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      verifyMessage: "验证中",
    }
  },
  componentDidMount(){
    this.verifyEmail();
  },

  render() {
    return <div>
      <Paper zDepth={1}
             style={{
             backgroundColor:ZenColor.white,
             boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)",
             padding:0,
             borderRadius:"5px"}}>
        <br/>
        <h1 style={{textAlign:"center", color:Colors.grey700}}>{this.state.verifyMessage}</h1>
        <div className="horizontal-center" style={{width:"40px", padding:"20px 0 40px 0"}}>
          <RefreshIndicator size={40} left={0} top={5}
                            style={{position:"relative"}}
                            loadingColor={ZenColor.orange}
                            status="loading"/>
        </div>
      </Paper>
    </div>
  },

  verifyEmail() {
    //Todo make token verification work
    console.log("this.props.params.token", this.props.params.token);
    Accounts.verifyEmail(this.props.params.token, (error)=> {
      if (error) {
        //Auto login is stopped intentionally in /server/startUp to prevent auto-redirect
        if (error.reason === "Login forbidden") {
          console.log("验证成功, 正在跳转");
          this.setState({verifyMessage: "验证成功, 正在跳转"});
          setTimeout(redirect.bind(this, '/login'), 1500)
        } else {
          console.log("error", error.reason);
          this.setState({verifyMessage: "验证码已经失效, 正在跳转"});
          setTimeout(redirect.bind(this, '/login'), 1500)
        }
      }
    });

    function redirect(url) {
      this.context.router.push(url);
    }
  }
});
//Todo change logo-zenid.svg

module.exports = VerifyEmailTokenPage;
