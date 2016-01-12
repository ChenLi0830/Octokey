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
  } = SvgIcons;


CategoryList = React.createClass({

  render(){

    return <List style={{backgroundColor:"white"}} subheader="类别">
      <ListItem primaryText="全部" rightIcon={<PlacesAllInclusive color={ZenColor.cyan}/>}/>
      <ListItem primaryText="上升最快" rightIcon={<SocialWhatshot color={ZenColor.cyan} />}/>
      <ListItem primaryText="社交 论坛" rightIcon={<CommunicationForum color={ZenColor.cyan} />}/>
      <ListItem primaryText="游戏" rightIcon={<HardwareVideogameAsset color={ZenColor.cyan} />}/>
      <ListItem primaryText="旅游" rightIcon={<MapsTerrain color={ZenColor.cyan} />}/>
      <ListItem primaryText="生活" rightIcon={<ImageBlurOn color={ZenColor.cyan} />}/>
      <ListItem primaryText="音乐 视频" rightIcon={<ImageAudiotrack color={ZenColor.cyan}/>}/>
    </List>
  }
});