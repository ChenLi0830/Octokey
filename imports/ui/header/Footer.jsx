/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-5-11
 *
 * Footer component
 *******************************************************************************/
import React from "react";
const styles = {
  container: {
    //position: "fixed",
    position: "absolute",
    bottom: "20px",
    width: "100%",
    textAlign: "center",
    color: "#AEBDC9",
    //marginBottom:"20px",
  },
};

var Footer = React.createClass({
  propTypes: {
    //location: React.PropTypes.object.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  render(){
    messages = this.context.intl.messages.header;

    return (<div style={styles.container}>
          <p>
            ©2016 Octokey | O钥匙 - <a href="http://webscan.360.cn/index/checkwebsite/url/oyaoshi.com"
                                     name="9b4249c04b2e8136624aa54bdae090f9"
                                     style={{color:"#AEBDC9"}}>360安全验证满分网站
          </a> | 鲁 ICP 备 16008215 号
          </p>
        </div>
    )
  },
});

module.exports = Footer;