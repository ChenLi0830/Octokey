const {Button,
  Modal,
  Input,
  ButtonInput,
  Col,
  Image,
  Row
  } = ReactBootstrap;

const {RaisedButton} = MUI;


CreatePrivateAppButton = React.createClass({

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
    alert("not finished yet :D");
  },

  render(){
    let button = (<div style={{textAlign:"center", padding:"10px 0 30px 0"}}>
        <p>找不到需要的网站标签?</p>
        <RaisedButton label="创建新网签"
                      secondary={true}
                      onClick={this.open}
                      labelStyle={{color:"white"}}/>
      </div>);

    return <div>
      {button}
      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>"创建新网签"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handlePrivateSubmit}>
            <Input type="text" label="网站名" ref="appName" placeholder="例如: Google"/>
            <Input type="text" label="登录链接" ref="loginLink" placeholder="例如: https://www.google.com/login"/>

            <Input type="file"
                   label="网站Logo"
                   ref="logoFile"
                   accept=".png, .jpg"
                   onChange={this.handleLogoUpload}
                   help=""/>
            <Row>
              <Col xs={6} md={4}>
                <Image ref="preview" src={this.state.preview} rounded/>
              </Col>
            </Row>

            <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
            <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

            <div>
              <Input type="text" label="用户名" ref="username"/>
              <Input type="password" label="密码" ref="password"/>
            </div>

            <ButtonInput type="submit" value="创建"/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  },

  handlePrivateSubmit(event){
    event.preventDefault();
    //Todo: implement this function
    alert("A private app is submitted. It should be added to the private app collection.");
    this.close();
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