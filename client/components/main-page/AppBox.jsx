const {
  Col,
  Thumbnail,
  } = ReactBootstrap;

AppBox = React.createClass({
  render(){
    return <Col xs={3} md={2}>
      <br/>
      <div className = "app-box" >
        <Thumbnail src="src/resources/amazon.png" alt="242x200">
          <h3>Thumbnail label</h3>
          <p>Description</p>
          <ConfigButton/>
        </Thumbnail>
      </div>
    </Col>
  }
});