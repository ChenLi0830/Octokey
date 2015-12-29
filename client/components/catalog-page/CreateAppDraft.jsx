const {Button,
  Modal,
  Input,
  ButtonInput
  } = ReactBootstrap;

CreateAppDraft = React.createClass({
  getInitialState() {//for modal
    return {showModal: false};
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
      <Button onClick = {this.open}>
        Create new app
      </Button>

      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Input type="text" label="Login Link" placeholder="Example: https://www.google.com" />
            <Input type="file" label="Logo" help="This is the logo you are going to see for your app (optional)" />
            <ButtonInput type="submit" value="Submit" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  }
});