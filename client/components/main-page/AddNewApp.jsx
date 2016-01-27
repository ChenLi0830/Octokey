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

    render(){
        return <div style={{paddingTop:"100px", paddingBottom:"100px", textAlign:"center"}}>
            <p>还没有网站?快去添加吧</p>
            <RaisedButton primary={true}
                          label="添加新网站"
                          onTouchTap={this.props.whenClicked}>
            </RaisedButton>
        </div>
    }
});