const {
    List,
    ListItem
    } = MUI;

const {
    ActionSearch
    } = SvgIcons;

SearchBox = React.createClass({

    context:{intl:React.PropTypes.object.isRequired},

    render(){
        return <List style={{backgroundColor:"white"}}>
            <ListItem primaryText={this.context.intl.messages.cata_search} leftIcon={<ActionSearch />}/>
        </List>;
    }
});