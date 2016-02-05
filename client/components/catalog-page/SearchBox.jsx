/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Search box component, called by "CatalogSideBar"
 *******************************************************************************/
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