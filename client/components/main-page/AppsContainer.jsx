const {
  Grid,
  Row
  } = ReactBootstrap;

AppsContainer = React.createClass({
  render(){
    return <div>
      <Grid>
        <Row>
          <AppBox/>
        </Row>
      </Grid>
    </div>
  }
});