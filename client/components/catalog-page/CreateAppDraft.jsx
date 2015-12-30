const {Button,
  Modal,
  Input,
  ButtonInput,
  Col,
  Image,
  Row
  } = ReactBootstrap;

CreateAppDraft = React.createClass({
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
    return <div>
      Can't find the app?
      <br/>
      <Button onClick={this.open}>
        Create new app
      </Button>

      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
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

            <ButtonInput type="submit" value="Submit"/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  },

  handleSubmit(event){
    event.preventDefault();
    let app = new FS.File(this.state.preview);
    app.loginLink = this.refs.loginLink.refs.input.value;
    app.appName = this.refs.appName.refs.input.value;

    ZenApps.insert(app, function (err, fileObj) {
      if (err) {
        console.log("there was an error", err);
      } else {//Logo uploaded successful
        //let imagesURL = "/cfs/files/logos/"+fileObj._id;
        //console.log("imagesURL:",imagesURL);
      }
    });
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