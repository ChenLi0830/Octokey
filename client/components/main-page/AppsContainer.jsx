//Todo: add configuration FAB

const {
    Grid,
    Row
    } = ReactBootstrap;

const {
    Paper,
    } = MUI;

let publicFocusedIndex = -1, privateFocusedIndex = -1;

AppsContainer = React.createClass({
    mixins: [ReactMeteorData],

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
        }
    },

    componentWillMount(){
        self = this;
        Meteor.call("inDevMode", function (error, inDevMode) {
            this.isInDevMode = inDevMode;
            console.log("this.isInDevMode", this.isInDevMode);
        }.bind(this));
    },

    render(){
        if (this.data.chosenPublicApps.length > 0) {
            var appBoxes = this.data.chosenPublicApps.map(function (userApp, i) {
                return <AppBox key={userApp.appId}
                               appId={userApp.appId}
                               logoURL={userApp.logoURL}
                               width="100%"
                               whenAppTileClicked={this.handleAppTileClick}
                    /*appName={userApp.appName}
                    loginLink={userApp.loginLink}
                    userNames={userApp.userNames}*/
                />
            }, this);
        } else {
            var appBoxes = <h4> Add new apps</h4>;
        }

        //console.log("appBoxes",appBoxes.count, appBoxes);
        let isPublicApp = publicFocusedIndex > -1;
        let appName = "", appId = "";
        if (this.state.openDialogCredential) {//Dialog is about to open
            if (isPublicApp) {
                appName = this.data.chosenPublicApps[publicFocusedIndex].appName;
                appId = this.data.chosenPublicApps[publicFocusedIndex].appId;
            } else {//private app
                alert("it is a private app!")
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
                              appContainer={this}
            />


            <FloatingEditButton whenEditButtonClicked={this.handleEditButtonClick}/>
            <Paper zDepth={1}
                   style={{
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

        if (publicFocusedIndex !== -1 && privateFocusedIndex === -1) {//是public app
            if (this.data.chosenPublicApps[publicFocusedIndex].userNames.length > 0) {
                this.handleGoToLink(this.data.chosenPublicApps[publicFocusedIndex].userNames)
            }
            else {
                this.handleOpenDialogCredential(publicFocusedIndex);
            }
        }
        else {//
            console.log("is private app")
        }
    },


    handleEditButtonClick(i){
        //this.setState({focusedIndex:i});
        alert(i + "is clicked");
    },

    handleOpenDialogCredential() {
        this.setState({openDialogCredential: true});
    },

    handleCloseDialogCredential() {
        this.setState({openDialogCredential: false});
    },

    handleGoToLink(userNames){
        //Assume the credential the user choose is the first one. Todo Needs to be changed when implementing multiple
        // credentials
        let username = userNames[0];

        //console.log("this.state.isInDevMode",this.state.isInDevMode);
        let targetUrl = this.isInDevMode ? "http://localhost:3000" : "http://114.215.98.118";
        //因为content script被嵌入了这个应用,所以要和content script通信,就发给自己就可以.
        //如果要修改这个值,记得还要修改 plugin 的 manifest.json file.

        //Todo 让这一步的Meteor.userID()放到server里执行
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
        console.log("publicFocusedIndex", publicFocusedIndex);
        console.log("appId", appId, "loginLink", loginLink);

        window.postMessage(//Communicate with plugin
            [
                "goToLink", Meteor.userId(), appId, loginLink, username
            ],
            targetUrl);
    },

});