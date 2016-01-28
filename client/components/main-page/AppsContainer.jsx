//Todo: add configuration FAB

const {
    Grid,
    Row
    } = ReactBootstrap;

const {
    Paper,
    } = MUI;

const {History} = ReactRouter;

let publicFocusedIndex = -1, privateFocusedIndex = -1;

AppsContainer = React.createClass({
    mixins: [ReactMeteorData, History],

    getMeteorData(){
        if (Meteor.user()) {
            let findUserApps = UserApps.find({userId: Meteor.userId()}).fetch()[0];
            return {
                currentUser: Meteor.user(),
                chosenPublicApps: findUserApps ? findUserApps.publicApps : [],
            }
        } else {
            return {
                currentUser: null,
                chosenPublicApps: [],
            }
        }
    },

    getInitialState(){
        return {
            openDialogCredential: false,
            userEditStatus: "default",
            openDialogEdit:false,
        }
    },

    componentWillMount(){
        Meteor.call("inDevMode", function (error, inDevMode) {
            this.isInDevMode = inDevMode;
        }.bind(this));
    },

    render(){
        if (!this.data.currentUser) {
            this.context.history.pushState(null, "/login");
        }

        if (this.data.chosenPublicApps.length > 0) {
            var appBoxes = this.data.chosenPublicApps.map(function (userApp, i) {
                return <AppBox key={userApp.appId}
                               appId={userApp.appId}
                               logoURL={userApp.logoURL}
                               width="100%"
                               whenAppTileClicked={this.handleAppTileClick}
                               userEditStatus={this.state.userEditStatus}
                />
            }, this);
        } else {
            var appBoxes = <AddNewApp whenClicked={this.handleNavigateToCatalog}/>;
        }

        //console.log("appBoxes",appBoxes.count, appBoxes);
        let isPublicApp = publicFocusedIndex > -1;
        let appName = "", appId = "";
        if (this.state.openDialogCredential || this.state.openDialogEdit) {//Dialog is about to open
            if (isPublicApp) {
                appName = this.data.chosenPublicApps[publicFocusedIndex].appName;
                appId = this.data.chosenPublicApps[publicFocusedIndex].appId;
            } else {//private app
                alert("it is a private app!");
                appName = "";
                appId = "";
            }
        }

        return <div>
            <CredentialDialog appName={appName}
                              appId={appId}
                              isPublicApp={isPublicApp}
                              openDialogCredential={this.state.openDialogCredential}
                              whenCloseDialog={this.handleCloseDialogCredential}
                              whenSubmitCredential={this.handleGoToLink}
            />

            {this.state.openDialogEdit ?
                <EditDialog appName={appName}
                            appId={appId}
                            isPublicApp={isPublicApp}
                            usernames = {isPublicApp?this.data.chosenPublicApps[publicFocusedIndex].userNames:null}
                            openDialogEdit = {this.state.openDialogEdit}
                            whenCloseDialog={()=>{this.setState({openDialogEdit: false})}}
                /> : null}

            <FocusOverlay visibility={this.state.userEditStatus!=="default"}/>

            <FloatingEditButton
                whenEditButtonClicked={this.handleEditButtonClick}
                userEditStatus={this.state.userEditStatus}
            />

            <Paper zDepth={1}
                   style={{
                   zIndex:"1400",
                   position:"relative",
                   backgroundColor:"#ffffff",
                   boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)",
                   padding:0,
                   borderRadius:"5px"}}>
                <Row style={{marginLeft:0, marginRight:0}}>
                    {appBoxes}
                </Row>
            </Paper>
        </div>
    },

    handleAppTileClick(appId){
        publicFocusedIndex = _.findIndex(this.data.chosenPublicApps, function (publicApp) {
            return publicApp.appId === appId;
        });
        privateFocusedIndex = -1;
        //TODO getPrivateFocusedIndex in the same way
        let isPublicApp = publicFocusedIndex !== -1 && privateFocusedIndex === -1;

        if (this.state.userEditStatus === "default") {
            if (isPublicApp) {//是public app
                if (this.data.chosenPublicApps[publicFocusedIndex].userNames.length > 0) {
                    //Todo 加入component让用户选择登录credential
                    let username = this.data.chosenPublicApps[publicFocusedIndex].userNames[0];
                    this.handleGoToLink(username, "");
                }
                else {
                    this.handleOpenDialogCredential(publicFocusedIndex);
                }
            }
            else {//
                console.log("is private app")
            }
        }

        else if (this.state.userEditStatus === "remove") {
            if (isPublicApp) {
                Meteor.call("removePublicApp", appId);
            } else {
                alert("remove private app!")
            }
        }
        else if (this.state.userEditStatus === "config") {
            if (isPublicApp) {
                this.setState({openDialogEdit:true});
            } else {
                alert("edit private app!")
            }
        }
    },


    handleEditButtonClick(i){
        console.log(i);
        if (typeof i === "object") {
            this.setState({userEditStatus: "default"});
        } else switch (i) {
            case 0:
                this.handleNavigateToCatalog();
                break;
            case 1:
                this.setState({userEditStatus: "remove"});
                break;
            case 2:
                this.setState({userEditStatus: "config"});
                break;
            default:
                alert(i + " is clicked, don't know how to handle.");
        }
        //this.setState({focusedIndex:i});
    },

    handleNavigateToCatalog(){
        this.context.history.pushState(null, "/catalog");
    },

    handleOpenDialogCredential() {
        this.setState({openDialogCredential: true});
    },

    handleCloseDialogCredential() {
        this.setState({openDialogCredential: false});
    },

    handleGoToLink(username, password){
        let targetUrl = this.isInDevMode ? "http://localhost:3000" : "http://114.215.98.118";
        //因为content script被嵌入了这个应用,所以要和content script通信,就发给自己就可以.
        //如果要修改这个值,记得还要修改 plugin 的 manifest.json file.

        //console.log("username: ",username);
        let isPublicApp = publicFocusedIndex > -1;
        let appId = "", loginLink = "";
        if (isPublicApp) {
            appId = this.data.chosenPublicApps[publicFocusedIndex].appId;
            loginLink = this.data.chosenPublicApps[publicFocusedIndex].loginLink;
        } else {//private app
            alert("it is a private app!");
            appId = "";
            loginLink = "";
        }
        //Todo 让这一步的Meteor.userID()放到server里执行
        window.postMessage(//Communicate with plugin
            [
                "goToLink", Meteor.userId(), appId, loginLink, username, password
            ],
            targetUrl);
    },

});