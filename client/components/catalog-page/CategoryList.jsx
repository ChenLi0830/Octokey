const {
  List,
  ListItem,
  Colors
  } = MUI;

const {
  PlacesAllInclusive,
  SocialWhatshot,
  CommunicationForum,
  HardwareVideogameAsset,
  MapsTerrain,
  ImageBlurOn,
  ImageAudiotrack,
  ContentGesture
  } = SvgIcons;

const nameToIcon = {
  "all": <PlacesAllInclusive color={ZenColor.cyan}/>,
  "hot": <SocialWhatshot color={ZenColor.cyan}/>,
  "social": <CommunicationForum color={ZenColor.cyan}/>,
  "game": <HardwareVideogameAsset color={ZenColor.cyan}/>,
  "travel": <MapsTerrain color={ZenColor.cyan}/>,
  "life": <ImageBlurOn color={ZenColor.cyan}/>,
  "media": <ImageAudiotrack color={ZenColor.cyan}/>
};

CategoryList = React.createClass({
  propTypes: {
    zenCategories: React.PropTypes.array.isRequired
  },

  render(){
    const tempIcon = <ContentGesture color={ZenColor.cyan}/>;
    const Items = this.props.zenCategories.map(function(category){
      const icon = nameToIcon[category.name] ? nameToIcon[category.name] : tempIcon;
      return <ListItem primaryText={category.displayTitleChinese} key={category._id} rightIcon={icon}/>
    });
    //console.log("Items ",Items);
    return <List style={{backgroundColor:"white"}} subheader="类别">
      {Items}
    </List>
  }
});