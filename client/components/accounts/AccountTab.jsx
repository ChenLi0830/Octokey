const style = {
    title: {
        color: ZenColor.blueGrey,
        margin:0,
    }
};

AccountTab = React.createClass({
    propTypes:{
        currentUser:React.PropTypes.object.isRequired,
    },

    render(){
        let title = this.props.currentUser ? <p style={style.title}>登出</p> : <p style={style.title}>登录</p>
        return title
    }
});