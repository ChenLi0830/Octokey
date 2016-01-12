const {
  Grid,
  Row,
  Col
  } = ReactBootstrap;

Catalog = React.createClass({
  render(){
    return <Grid>
        <Row>
          <Col sm={3} >
            <CatalogSideBar/>
          </Col>
          <Col sm={9} >
            <CatalogAppsBox/>
          </Col>
        </Row>
    </Grid>
  }
});