const {
    Glyphicon
    } = ReactBootstrap;

ConfigButton = React.createClass({
    render(){
        return <div>
            <Glyphicon glyph="cog" className="config-button"/>
        </div>
    }
});