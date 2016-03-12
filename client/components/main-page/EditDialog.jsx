/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Dialog component for user to edit an app's credential, called by "AppsContainer"
 *******************************************************************************/
var AddNewCredentialDialog = require('./AddNewCredentialDialog.jsx');

const {
    Dialog,
    FlatButton,
    TextField,
    List,
    ListItem,
    RaisedButton,
    Divider,
    Popover,
    Menu,
    MenuItem,
    } = MUI;

const {
    ActionInfo,
    ActionDelete,
    } = SvgIcons;


const style = {
    menu: {
        marginRight: 0,
        marginBottom: 0,
        float: 'left',
        position: 'relative',
        zIndex: 0,
    },
    rightIcon: {
        textAlign: 'center',
        lineHeight: '24px',
    },
    addNewAccountButton: {
        marginTop: "10px",
    }
};

const {FormattedMessage} = ReactIntl;

var EditDialog = React.createClass({
    propTypes: {
        appName: React.PropTypes.string.isRequired,
        appId: React.PropTypes.string.isRequired,
        isPublicApp: React.PropTypes.bool.isRequired,
        usernames: React.PropTypes.array.isRequired,
        openDialogEdit: React.PropTypes.bool.isRequired,
        whenCloseDialog: React.PropTypes.func.isRequired,
        hexIv: React.PropTypes.string.isRequired,
    },

    contextTypes:{
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState(){
        return {
            popOverOpen: false,
            openDialogAdd: false,
            focusedUsername: null,
        };
    },

    handleTouchTap(username, event){
        //console.log("username", username);
        //console.log("event", event);
        this.setState({
            popOverOpen: true,
            anchorEl: event.currentTarget,
            focusedUsername: username
        });
    },

    handleRequestClose() {
        this.setState({
            popOverOpen: false,
        });
    },

    handleRemoveAccount(){
        let focusedUsername = this.state.focusedUsername;
        this.setState({
            popOverOpen: false,
            openDialogAdd: false,
            focusedUsername: null,
        }, function () {//setState完成后再remove,保证UI不出glitch
            removeCredential(this.props.appId, focusedUsername);
        });
    },

    render(){
        const {messages} = this.context.intl;
        const actions = [
            <RaisedButton label={messages.app_editDialogAdd}
                          style={style.addNewAccountButton}
                          onTouchTap={()=>{this.setState({openDialogAdd:true})}}
                          secondary={true}/>,
            <FlatButton
                label={messages.app_editDialogFinish}
                secondary={true}
                onTouchTap={this.props.whenCloseDialog}/>,
        ];

        let userNameList = this.props.usernames.map(function (username) {
            return <ListItem key={username} primaryText={username}
                             onTouchTap={this.handleTouchTap.bind(this, username)}
                             rightIcon={<ActionInfo/>}/>
        }, this);

        return <FormattedMessage id="app_editDialogTitle" values={{appName:this.props.appName}}>
            {(formattedValue)=>(
                <Dialog
                    title={formattedValue}
                    actions={actions}
                    autoDetectWindowHeight={false}
                    autoScrollBodyContent={true}
                    open={this.props.openDialogEdit}
                    onRequestClose={this.props.whenCloseDialog}>

                    {/*This is here to stop chrome's username and password autofill*/}
                    <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                    <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

                    <List>
                        {userNameList}
                    </List>

                    <Popover
                        open={this.state.popOverOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose}>
                        <div style={{padding: 0}}>
                            <Menu style={style.menu}>
                                <MenuItem primaryText={messages.app_editDialogDel} leftIcon={<ActionDelete/>}
                                          onTouchTap={this.handleRemoveAccount}/>
                            </Menu>
                        </div>
                    </Popover>

                    <AddNewCredentialDialog appName={this.props.appName}
                                            appId={this.props.appId}
                                            isPublicApp={this.props.isPublicApp}
                                            openDialogAdd={this.state.openDialogAdd}
                                            whenCloseDialog={()=>{this.setState({openDialogAdd: false})}}
                                            hexIv={this.props.hexIv}/>

                    <Divider />
                </Dialog>
            )}
        </FormattedMessage>
    }
});

module.exports = EditDialog;