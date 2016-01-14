const {
  Col,
  } = ReactBootstrap;

const {
  Paper,
  Dialog,
  FlatButton,
  TextField
  } = MUI;

AppBox = React.createClass({

  propTypes: {
    appId: React.PropTypes.string.isRequired,
    appName: React.PropTypes.string.isRequired,
    logoURL: React.PropTypes.string.isRequired,
    loginLink: React.PropTypes.string.isRequired,
    width: React.PropTypes.string.isRequired,
    userNames: React.PropTypes.array.isRequired
  },

  getInitialState(){
    return {
      hovered: false,
      open: false,
      floatingUserText: "",
      floatingPassText: "",
      userNameFilled: false,
      passwordFilled: false,
      boxHeight: "0px",
      isInDevMode:null,
    }
  },

/*  mixins: [ReactMeteorData],
  getMeteorData(){//这部分移动到background script里,获取对应的app password
    if (this.props.userNames.length>0){
      Meteor.subscribe("appCredential", this.props.appId, this.props.userNames[0], function () {
        //console.log("subscribe successful");
        const credential = UserAppCredentials.find().fetch();
        console.log("credential", credential);
      }.bind(this));
    }
    return {}
  },*/

  componentDidMount(){
    var boxSize = ReactDOM.findDOMNode(this.refs.appBox).offsetWidth;
    this.setState({//这里会trigger DOM re-render
      height: boxSize
    });
    Meteor.call("inDevMode", function(error, inDevMode){
      this.setState({isInDevMode : inDevMode});
    }.bind(this));

    //console.log("appBox width",ReactDOM.findDOMNode(this.refs.appBox).offsetWidth);
  },

  handleMouseOver(){
    this.setState({
      hovered: true
    })
  },

  handleMouseOut(){
    this.setState({
      hovered: false
    })
  },

  handleOpenModal() {
    this.setState({open: true});
  },

  handleCloseModal() {
    this.setState({open: false});
  },

  handleInputErrorCheckUser(){
    let userName = this.refs.username.getValue();
    if (!userName) {
      this.setState({floatingUserText: "用户名不能为空"});
    } else {
      this.setState({floatingUserText: ""});
    }
  },

  handleInputErrorCheckPass(){
    let password = this.refs.password.getValue();
    if (!password) {
      this.setState({floatingPassText: "密码不能为空"});
    } else {
      this.setState({floatingPassText: ""});
    }
  },

  handleSubmit(){
    /* Error check */
    this.handleInputErrorCheckUser();
    this.handleInputErrorCheckPass();

    /* Save data & Handle login */
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();

    if (username && password) {
      //console.log("appId", this.props.appId, "username:", username, " password: ", password);

      Meteor.call("addNewCredential", this.props.appId, username, password);
      Meteor.call("appAddUsername", this.props.appId, username);

      this.handleGoToLink();
      //TODO 询问用户是否登录成功,如果否,删除用户登录信息,保留textFields, 如果是,关闭modal.
    }
  },

  handleGoToLink(){
    //Assume the credential the user choose is the first one. Needs to be changed when implementing multiple credentials

    //console.log("this.state.isInDevMode",this.state.isInDevMode);
    let targetUrl = this.state.isInDevMode ? "http://localhost:3000" : "http://zenid.meteor.com";
    //因为content script被嵌入了这个应用,所以要和content script通信,就发给自己就可以.
    //如果要修改这个值,记得还要修改 plugin 的 manifest.json file.

    console.log(targetUrl);
    window.postMessage(//Communicate with plugin
      [
        "goToLink", Meteor.userId(), this.props.appId, this.props.loginLink, this.props.userNames[0]
      ],
      targetUrl);
  },

  render() {
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleCloseModal}/>,
      <FlatButton
        secondary={true}
        label="去登录"
        onTouchTap={this.handleSubmit}/>
    ];


    //console.log("this.props.userNames",this.props.userNames);
    //console.log("this.props.userNames.length",this.props.userNames.length);
    let onTouchTapEvent = this.props.userNames.length>0 ? this.handleGoToLink : this.handleOpenModal;

    const appBoxButton = (<Col xlg={1} md={2} sm={3} xs={6} style={{padding:"0"}}>
      <Paper rounded={false}
             ref="appBox"
             style={{
               backgroundColor:this.state.hovered?"#FAFAFA":"rgba(255, 255, 255, 0.0)",
               margin:0,
               borderRadius:"5px",
               width:this.props.width,
               height:this.state.height,
               cursor: "pointer"}}
             onMouseOver={this.handleMouseOver}
             onMouseOut={this.handleMouseOut} zDepth={this.state.hovered?1:0}
             onTouchTap={onTouchTapEvent}>
        <img src={this.props.logoURL} style={{width:"100px"}} className="vertical-center horizontal-center"/>
      </Paper>
    </Col>);

    const credentialModal = (
      <Dialog
        title={"请输入你在"+"\""+this.props.appName+"\"的登录信息 (只需输入一次)"}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleCloseModal}>

        {/*This is here to stop chrome's username and password autofill*/}
        <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
        <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

        <TextField
          ref="username"
          style={{fontWeight:"300"}}
          floatingLabelStyle={{fontWeight:"300"}}
          errorText={this.state.floatingUserText}
          onChange={this.handleInputErrorCheckUser}
          floatingLabelText="用户名"/>
        <br/>
        <TextField
          ref="password"
          type="password"
          style={{fontWeight:"300"}}
          floatingLabelStyle={{fontWeight:"300"}}
          errorText={this.state.floatingPassText}
          onChange={this.handleInputErrorCheckPass}
          floatingLabelText="密码"/>
      </Dialog>
    );
    return <div>
      {appBoxButton}
      {credentialModal}
    </div>
  }
})
;