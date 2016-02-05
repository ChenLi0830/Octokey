/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Dialog for Add New Account for an App, called when user haven't subscribe any app, called
 * by "AppsContainer" component.
 *******************************************************************************/
const {
    RaisedButton,
    } = MUI;

const {
    Col,
    } = ReactBootstrap;

AddNewApp = React.createClass({
    propTypes:{
        whenClicked:React.PropTypes.func.isRequired,
    },

    contextTypes:{
        intl: React.PropTypes.object.isRequired,
    },

    render(){
        return <div style={{paddingTop:"100px", paddingBottom:"100px", textAlign:"center"}}>
            <p>{this.context.intl.messages.app_noAppMessage}</p>
            <RaisedButton primary={true}
                          label={this.context.intl.messages.app_noAppBtn}
                          onTouchTap={this.props.whenClicked}>
            </RaisedButton>
        </div>
    }
});