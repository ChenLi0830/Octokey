const {
  Col,
  Thumbnail,
  } = ReactBootstrap;

AppBox = React.createClass({
  render(){
    return <Col xs={3} md={2}>
      <br/>
      <div className = "app-box" >
        <LogoContainer logoURL={this.props.logoURL} showConfig={this.props.showConfig}/>
        <p>{this.props.appName}</p>
      </div>
    </Col>
  }
});