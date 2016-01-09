const {
  List,
  ListItem,
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
      <ListItem primaryText="全部" leftIcon={<PlacesAllInclusive />}/>
      <ListItem primaryText="上升最快" leftIcon={<SocialWhatshot />}/>
      <ListItem primaryText="社交 论坛" leftIcon={<CommunicationForum />}/>
      <ListItem primaryText="游戏" leftIcon={<HardwareVideogameAsset />}/>
      <ListItem primaryText="旅游" leftIcon={<MapsTerrain />}/>
      <ListItem primaryText="生活" leftIcon={<ImageBlurOn />}/>
      <ListItem primaryText="音乐 视频" leftIcon={<ImageAudiotrack />}/>
    </List>
  }
});