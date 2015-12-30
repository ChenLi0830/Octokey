const {
  Row,
  Col,
  Button
  } = ReactBootstrap;

CatelogSingleAppBox = React.createClass({
  getInitialState(){
    return {
      added: false
    }
  },

  render(){
    let addButton = this.state.added ? <Button bsStyle="success" className="add-button">Added</Button> :
      <Button onClick={this.handleClick} className="add-button">Add</Button>;

    return <Row className="single-app-row">
      <Col md={3} className="vertical-center"><LogoContainer logoURL={this.props.logoURL} showConfig={false}/></Col>
      <Col md={7} className="vertical-center">{this.props.appName}</Col>
      <Col md={2} className="vertical-center">{addButton}</Col>
    </Row>
  },

  handleClick(){
    this.setState({added: true});
  }
});