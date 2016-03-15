/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Universal AppLoading component. Called by components that require subscription
 * from Meteor server, such as "Catalog" or "App".
 *******************************************************************************/
const {RefreshIndicator,Paper  } = MUI;

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
