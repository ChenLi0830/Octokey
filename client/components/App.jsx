App = React.createClass({
  render(){
    return (
      <div>
        <Header/>
        ZenID App.
        {this.props.children}
      </div>
    )
  }
});
