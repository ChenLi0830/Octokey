/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Category list in Sidebar, called by "CatalogSideBar"
 *******************************************************************************/
import React from "react"
import {List, ListItem} from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";

var Actions = require("../action-and-stores/Actions.jsx");

import {
    PlacesAllInclusive,
    SocialWhatshot,
    CommunicationForum,
    HardwareVideogameAsset,
    MapsTerrain,
    ImageBlurOn,
    ImageAudiotrack,
    ContentGesture,
    PlacesPool,
    ActionShoppingBasket,
    ActionExplore,
    SocialSchool,
    ActionLightbulbOutline,
    ActionUpdate,
    ActionAssignmentInd,
    CommunicationImportContacts,
    CommunicationMailOutline,
    EditorBubbleChart,
    NotificationOndemandVideo,
    AvMusicVideo,
} from "material-ui/svg-icons"

const iconColor = ZenColor.cyan;

const nameToIcon = {
  "all": <PlacesAllInclusive color={iconColor}/>,
  "hot": <SocialWhatshot color={iconColor}/>,
  "social": <CommunicationForum color={iconColor}/>,
  "game": <HardwareVideogameAsset color={iconColor}/>,

  "travel": <MapsTerrain color={iconColor}/>,
  "lifestyle": <ImageBlurOn color={iconColor}/>,
  "entertainment": <ImageAudiotrack color={iconColor}/>,
  "sports": <PlacesPool color={iconColor}/>,
  "shopping": <ActionShoppingBasket color={iconColor}/>,

  "recommend": <ActionExplore color={iconColor}/>,
  "education": <SocialSchool color={iconColor}/>,
  "productivity": <ActionLightbulbOutline color={iconColor}/>,
  "news": <ActionUpdate color={iconColor}/>,
  "business": <ActionAssignmentInd color={iconColor}/>,
  "novels": <CommunicationImportContacts color={iconColor}/>,
  "email": <CommunicationMailOutline color={iconColor}/>,
  "animation": <EditorBubbleChart color={iconColor}/>,
  "video": <NotificationOndemandVideo color={iconColor}/>,
  "blog": <CommunicationForum color={iconColor}/>,
  "music": <AvMusicVideo color={iconColor}/>,

};

var CategoryList = React.createClass({
  propTypes: {
    allCategories: React.PropTypes.array.isRequired
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string.isRequired,
  },

  getInitialState(){
    return {
      chosenCategory: "all",
    }
  },

  handleTouchTap(categoryName){
    Actions.selectNewCategory(categoryName);
    this.setState({chosenCategory: categoryName});
    //console.log("categoryName", categoryName);
  },

  render(){
    const tempIcon = <ContentGesture color={ZenColor.cyan}/>;
    const selectedItem = {backgroundColor: ZenColor.grey2};
    const Items = this.props.allCategories.map(function (category) {
      const icon = nameToIcon[category.name] ? nameToIcon[category.name] : tempIcon;
      return <ListItem
          key={category._id}
          onTouchTap={this.handleTouchTap.bind(this, category.name)}
          style={this.state.chosenCategory == category.name ? selectedItem : null}
          rightIcon={icon}
          primaryText={this.context.locale==="zh" && category.displayTitleChinese ||
                                this.context.locale==="en-US" && category.displayTitleEnglish ||
                                category.displayTitleEnglish//If nothing is matched, use English
                            }
      />

    }, this);
    //console.log("Items ",Items);
    return <List style={{backgroundColor:"white"}}>
      <Subheader>{this.context.intl.messages.cata_category}</Subheader>
      {Items}
    </List>
  },
});

module.exports = CategoryList;