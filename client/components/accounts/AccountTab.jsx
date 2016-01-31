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

AccountTab = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object,
    },

    render(){
        //console.log("this.props.currentUser", this.props.currentUser);
        let accountTab = this.props.currentUser ? <p style={style.title}>登出</p>
            /*<IconMenu
                iconButtonElement={<p style={style.title}>{this.props.currentUser.emails[0].address}</p>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
                <MenuItem primaryText="登出" onTouchTap={()=>{Meteor.logout()}}/>
            </IconMenu>*/
            : <p style={style.title}>登录</p>;
        return accountTab
    }
});