const {
    List,
    ListItem
    } = MUI;

const {
    ActionSearch
    } = SvgIcons;

const {FormattedMessage} = ReactIntl;

SearchBox = React.createClass({

    render(){
        return <List style={{backgroundColor:"white"}}>
            <ListItem primaryText={<FormattedMessage id="cata_search"/>} leftIcon={<ActionSearch />}/>
        </List>;
        //var ITEMS = ['ruby', 'javascript', 'lua', 'go', 'julia', 'c', 'scala', 'haskell'];
        /*return <div>
         <ReactSearchBar items={ITEMS} placeholder="Search new App" ItemElement= "span"/>
         </div>*/
    }
});