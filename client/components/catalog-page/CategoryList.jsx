const {
  ListGroup,
  ListGroupItem
  } = ReactBootstrap;

CategoryList= React.createClass({

  handleClick(){
    alert('Catalog-sideBar: You clicked the ListGroupItem');
  },

  render(){
    return <div>
      <ListGroup>
        <ListGroupItem href="#" onClick={this.handleClick}>Link 1</ListGroupItem>
        <ListGroupItem href="#" onClick={this.handleClick}>Link 1</ListGroupItem>
        <ListGroupItem href="#" onClick={this.handleClick}>Link 1</ListGroupItem>
      </ListGroup>
    </div>
  }
});