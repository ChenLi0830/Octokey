const {
    List,
    ListItem
    } = MUI;

const {
    ActionSearch
    } = SvgIcons;

SearchBox = React.createClass({

    render(){
        return <List style={{backgroundColor:"white"}}>
            <ListItem primaryText="搜索应用" leftIcon={<ActionSearch />}/>
        </List>;
        //var ITEMS = ['ruby', 'javascript', 'lua', 'go', 'julia', 'c', 'scala', 'haskell'];
        /*return <div>
         <ReactSearchBar items={ITEMS} placeholder="Search new App" ItemElement= "span"/>
         </div>*/
    }
});