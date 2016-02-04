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