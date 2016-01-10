const {
  Grid,
  Row,
  Col
  } = ReactBootstrap;

Catalog = React.createClass({
  render(){
    return <Grid>
        <Row>
          <Col md={3} >
            <CatalogSideBar/>
          </Col>
          <Col md={9} >
            <CatalogAppsBox/>
          </Col>
        </Row>
    </Grid>
  }
});