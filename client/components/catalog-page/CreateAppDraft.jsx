const {Button,
  Modal,
  Input,
  ButtonInput,
  Col,
  Image,
  Row
  } = ReactBootstrap;

const {RaisedButton} = MUI;


CreateAppDraft = React.createClass({
  propTypes: {
    createPublicApp: React.PropTypes.bool.isRequired
  },

  getInitialState() {//for modal
    return {
      showModal: false,
      preview: ""
    };
  },

  close() {//for modal
    this.setState({showModal: false});
  },

  open() {//for modal
    this.setState({showModal: true});
  },

  render(){
    let button = this.props.createPublicApp ?
      (<div style={{textAlign:"center", padding:"10px 0 20px 0"}}>
        <RaisedButton label="创建Zen网签"
                     primary={true}
                     onClick={this.open}
                     labelStyle={{color:"white"}}/>
      </div>) :
      (<div style={{textAlign:"center", padding:"10px 0 30px 0"}}>
        <p>找不到需要的网站标签?</p>
        <RaisedButton label="创建新网签"
                       primary={true}
                       onClick={this.open}
                       labelStyle={{color:"white"}}/>
      </div>);

    let privateAppContent = !this.props.createPublicApp ? (
      <div>
        <Input type="text" label="Username" ref="username"/>
        <Input type="password" label="Password" ref="password"/>
      </div>
    ) : null;

    let title = this.props.createPublicApp? "创建Zen网签" : "创建新网签";

    return <div>
      {button}
      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.props.createPublicApp ? this.handlePublicSubmit : this.handlePrivateSubmit}>
            <Input type="text" label="Website Name" ref="appName" placeholder="Example: Google"/>
            <Input type="text" label="Login Link" ref="loginLink" placeholder="Example: https://www.google.com"/>

            <Input type="file"
                   label="Website Logo"
                   ref="logoFile"
                   accept=".png, .jpg"
                   onChange={this.handleLogoUpload}
                   help="Logo of the app (optional)"/>
            <Row>
              <Col xs={6} md={4}>
                <Image ref="preview" src={this.state.preview} rounded/>
              </Col>
            </Row>

            {privateAppContent}

            <ButtonInput type="submit" value="Submit"/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  },

  handlePublicSubmit(event){
    event.preventDefault();
    const loginLink = this.refs.loginLink.refs.input.value;
    const appName = this.refs.appName.refs.input.value;

    Meteor.call("addZenApp", appName, loginLink, this.state.preview);
  },

  handlePrivateSubmit(event){
    event.preventDefault();
    //Todo: implement this function
    console.log("A private app is submited. It should be added to the private app collection.")
  },

  handleLogoUpload(){
    let logoFile = this.refs.logoFile.refs.input.files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
      this.setState({
        preview: reader.result
      });
    }.bind(this);

    reader.readAsDataURL(logoFile);
  }
});