const {Grid,
  Row} = ReactBootstrap;

AppHome = React.createClass({
  render(){
    return <div>
      <Grid>
        <Row>
          <AppsFolder/>
          <AppsContainer/>
        </Row>
      </Grid>
    </div>
  }
});