/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-7
 *
 * Choose Topic Page component for users to choose their interested topics
 *******************************************************************************/
import React from "react"
import {colors as Colors} from "material-ui/styles";
import {Col, Row, Grid} from "react-bootstrap";

const WhiteOverlay = require('./WhiteOverlay.jsx');
const RecommendedAppBox = require('./RecommendedAppBox.jsx');

const ChooseAppPage = React.createClass({
  propTypes: {
    onClosePage: React.PropTypes.func.isRequired,
    openPage: React.PropTypes.bool.isRequired,
  },

  render(){
    return (
        <WhiteOverlay entrance="fadeInLeft"
                      exit="fadeOutLeft"
                      openOverlay={this.props.openPage}>
          <Grid>
            <div className="animated fadeInUp"
                 style={{margin: "50px auto 20px auto", textAlign:"center"}}>
              <h1 style={{color:Colors.grey800}}>网站订制推荐</h1>
              <h2 style={{color:Colors.grey600, fontWeight:"100"}}>添加新应用,
                给你的Octokey超能力{'\u26A1'}</h2>
            </div>

            <Col xs={8} xsOffset={2}>
              <RecommendedAppBox/>
            </Col>
          </Grid>
        </WhiteOverlay>
    )
  },
});

module.exports = ChooseAppPage;

