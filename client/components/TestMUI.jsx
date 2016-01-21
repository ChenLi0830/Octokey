//app.jsx
injectTapEventPlugin();

var {
    AppCanvas,
    AppBar,
    Styles,
    RaisedButton,
    DatePicker,
    FloatingActionButton,
    AutoComplete,
    IconButton
    } = MUI;

var { ThemeManager} = Styles;

TestMUI = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(ZenRawTheme)
        };
    },

    render: function () {

        //var layout = getOrGenerateLayout();
        return (
            <AppCanvas>
                <AppBar title="izziLab"/>

                <div style={{padding: '80px',}}>
                    <RaisedButton primary={true} label="Tap"/>
                    <br/>
                    <DatePicker hintText="Portrait Dialog"/>
                    <br/>
                    <DatePicker
                        hintText="Landscape Dialog"
                        mode="landscape"/>
                </div>

            </AppCanvas>
        );
    }
});


