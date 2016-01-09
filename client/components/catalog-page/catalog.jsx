const {
  Grid,
  Row,
  Col
  } = ReactBootstrap;

Catalog = React.createClass({
  render(){
    return <div>
        <Row>
          <Col md={3} style={{paddingRight:0}}>
            <CatalogSideBar/>
          </Col>
          <Col md={9} style={{paddingLeft:0}}>
            <CatalogAppsBox/>
          </Col>
        </Row>
    </div>
  }
});