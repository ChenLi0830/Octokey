const {
  Panel,
  ListGroup,
  ListGroupItem
  } = ReactBootstrap;

CatalogAppsBox = React.createClass({

  render(){
    const title = (
      <h3>Panel title</h3>
    );
    return <div>
        <Panel header={title} bsStyle="primary">
        <ListGroup>
          <ListGroupItem>Item 1</ListGroupItem>
          <ListGroupItem>Item 2</ListGroupItem>
          <ListGroupItem>...</ListGroupItem>
        </ListGroup>
      </Panel>
    </div>
  }
});