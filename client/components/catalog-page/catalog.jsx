const {
  Grid,
  Row,
  Col
  } = ReactBootstrap;

Catalog = React.createClass({
  render(){
    return <div>
        <Row>
          <Col xs={4} md={4}>
            <CatalogSideBar/>
          </Col>
          <Col xs={8} md={8}>
            <CatalogAppsBox/>
          </Col>
        </Row>
    </div>
  }
});