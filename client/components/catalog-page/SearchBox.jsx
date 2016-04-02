/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Search box component, called by "CatalogSideBar"
 *******************************************************************************/
var CatalogSingleApp = require('./CatalogSingleApp.jsx');
const {
    TextField,
    MenuItem,
    Popover
    } = MUI;

const {
    ActionSearch
    } = SvgIcons;

var SearchBox = React.createClass({

  contextTypes: {
    intl: React.PropTypes.object.isRequired
  },

  propTypes: {
    zenApps: React.PropTypes.array.isRequired,
    subscribeList: React.PropTypes.array.isRequired,
    allCategories: React.PropTypes.array.isRequired,
  },

  getInitialState(){
    return {
      searchText: "",
      searchResult: null,
      popOpen: false,
      searchOnFocus: false,
    }
  },

  render(){

    return <div style={{padding:20}}>
      <ActionSearch
          style={{height:30,width:30,verticalAlign:"middle",
                        fill:this.state.searchOnFocus ? "rgba(158,158,158,1)":"rgba(158,158,158,0.53)"}}
      />
      <TextField
          hintText={this.context.intl.messages.cata_search}
          value={this.state.searchText}
          onChange={this.handleSearch}
          style={{width:180}}
          onMouseEnter={()=>{this.setState({searchOnFocus:true})}}
          onMouseLeave={()=>{this.setState({searchOnFocus:false})}}
          onKeyDown={(e)=>{e.key==='Escape' && this.setState({searchText:"",popOpen:false});}}
      />
      <Popover
          open={this.state.popOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={()=>{this.setState({popOpen:false})}}
      >
        {this.state.searchResult}
        {/*this.state.searchResult && this.state.searchResult.length>0?this.state.searchResult[0]:null*/}
      </Popover>
    </div>
  },

  handleSearch(event){
    let eventTarget = event.currentTarget;
    this.setState({searchText: event.target.value},
        function () {
          if (this.state.searchText.trim().length > 0) {

            Meteor.call("searchApps", this.state.searchText.trim(), (error, searchResult)=> {
              if (error) {
                console.log("error", error);
                return;
              }
              let renderedResult = searchResult.map((app)=>{
                const logoURL = OctoAPI.getLogoUrl(app._id),
                      subscribed = this.props.subscribeList[app._id];

                return <CatalogSingleApp key={app._id}
                                         logoURL={logoURL}
                                         appName={app.appName}
                                         loginLink={app.loginLink}
                                         registerLink={app.registerLink}
                                         selectedCategoryNames={app.categoryNames}
                                         appId={app._id}
                                         subscribed={subscribed}
                                         condensed={true}
                                         allCategories = {this.props.allCategories}
                />
              });

              const finalResult = (renderedResult.length === 0 ?
                  this.context.intl.messages.cata_notFound :
                  renderedResult);

              this.setState({
                searchResult: finalResult,
                popOpen: true,
                anchorEl: eventTarget,
              });
            });

            this.setState({
              searchResult: null,
              popOpen: false,
            });
          }
        }.bind(this));
  }
});

module.exports = SearchBox;