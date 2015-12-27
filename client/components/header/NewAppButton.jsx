const {
  Link,
  } = ReactRouter;

NewAppButton = React.createClass({
  render(){
    return <li>
      <Link to="/catalog">
        NEW APP
      </Link>
    </li>
  }
});