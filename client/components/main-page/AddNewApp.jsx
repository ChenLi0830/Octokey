const {
    RaisedButton,
    } = MUI;

const {
    Col,
    } = ReactBootstrap;

const {FormattedMessage} = ReactIntl;

AddNewApp = React.createClass({
    propTypes:{
        whenClicked:React.PropTypes.func.isRequired,
    },

    render(){
        return <div style={{paddingTop:"100px", paddingBottom:"100px", textAlign:"center"}}>
            <p><FormattedMessage id="app_noAppMessage"/></p>
            <RaisedButton primary={true}
                          label={<FormattedMessage id="app_noAppBtn"/>}
                          onTouchTap={this.props.whenClicked}>
            </RaisedButton>
        </div>
    }
});