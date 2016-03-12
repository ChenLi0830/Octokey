/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Account tab component in header, called by "Header"
 *******************************************************************************/
const style = {
    title: {
        color: ZenColor.blueGrey,
        margin: 0,
    }
};

const {
    MenuItem,
    IconMenu,
    IconButton
    }=MUI;

const {
    NavigationMoreVert
    } = SvgIcons;

var AccountTab = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object,
    },

    contextTypes:{
        intl: React.PropTypes.object.isRequired,
    },

    render(){
        const {messages} = this.context.intl;
        //console.log("this.props.currentUser", this.props.currentUser);
        let accountTab = this.props.currentUser ? <p style={style.title}>{messages.tab_signOut}</p>
            /*<IconMenu
             iconButtonElement={<p style={style.title}>{this.props.currentUser.emails[0].address}</p>}
             anchorOrigin={{horizontal: 'left', vertical: 'top'}}
             targetOrigin={{horizontal: 'left', vertical: 'top'}}
             >
             <MenuItem primaryText="登出" onTouchTap={()=>{Meteor.logout()}}/>
             </IconMenu>*/
            : <p style={style.title}>{messages.tab_signIn}</p>;
        return accountTab
    }
});

module.exports = AccountTab;