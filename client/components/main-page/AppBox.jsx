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
    configured: React.PropTypes.bool.isRequired,
    logoURL: React.PropTypes.string.isRequired,
    loginLink:React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired
  },

  getInitialState(){
    return {
      hovered: false,
      open: false,
      floatingUserText: "",
      floatingPassText: "",
      userNameFilled: false,
      passwordFilled: false
    }
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
      console.log("appId",this.props.appId,"username:",username," password: ",password );

      Meteor.call("addNewCredential", this.props.appId, username, password);
      Meteor.call("appConfigured", this.props.appId);

      alert("start to login.");
      //Todo communicate with 插件,并打开新窗口,跳转到登录页面
      //询问用户是否登录成功,如果否,删除用户登录信息,保留textFields, 如果是,关闭modal.
    }
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

    const appBoxButton = (<Col md={2} style={{padding:"0"}}>
      <Paper rounded={false}
             style={{
               backgroundColor:this.state.hovered?"#FAFAFA":"rgba(255, 255, 255, 0.0)",
               margin:0,
               borderRadius:"5px",
               width:this.props.width,
               height:this.props.width,
               cursor: "pointer"}}
             onMouseOver={this.handleMouseOver}
             onMouseOut={this.handleMouseOut} zDepth={this.state.hovered?1:0}
             onTouchTap={this.handleOpenModal}>
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