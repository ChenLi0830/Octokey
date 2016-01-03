const {Thumbnail} = ReactBootstrap;

LogoContainer = React.createClass({
  propTypes:{
    logoURL: React.PropTypes.string,
    showConfig: React.PropTypes.bool.isRequired
  },

  render(){
    return <Thumbnail src={this.props.logoURL} alt="242x200" className="logoContainer">
      {this.props.showConfig? <ConfigButton/> : null}
    </Thumbnail>
  }
});