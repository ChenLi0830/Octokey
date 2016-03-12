const defaultIconStyle = {
    backgroundSize: "contain",
    backgroundPosition: "50%",
    backgroundRepeat: "noRepeat",
    position: "relative",
    display: "inline-block",
    width: 32,
    height: 24,
};

var LanguageIcon = React.createClass({

    //mixins: [PureRenderMixin],

    propTypes: {
        iconName: React.PropTypes.string.isRequired,
        style: React.PropTypes.object,
    },

    render() {
        return (
            //Merge styles - latter object will overwrites the former ones when use "_.extend"
            <span style={_.extend({}, defaultIconStyle, this.props.style,
                        {backgroundImage: "url(../img/flags/"+this.props.iconName+".svg)"})
                  }
            />
        );
    }

});

module.exports = LanguageIcon;