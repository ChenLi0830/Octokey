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
    } = MUI;

const {
    ActionSearch
    } = SvgIcons;

import { Popover} from 'antd';

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

        <Popover overlay={this.state.searchResult}
            //this.state.searchResult
                 visible={this.state.popOpen}
                 placement="bottom"
                 overlayStyle={{zIndex:"inherit"}}
            trigger="click"
            onVisibleChange={this.handlePopVisibleChange}

        >
          <TextField
              hintText={this.context.intl.messages.cata_search}
              value={this.state.searchText}
              onChange={this.handleSearch}
              style={{width:180}}
              onMouseEnter={()=>{this.setState({searchOnFocus:true})}}
              onMouseLeave={()=>{this.setState({searchOnFocus:false})}}
              onKeyDown={(e)=>{e.key==='Escape' && this.setState({searchText:"",popOpen:false});}}
          />
        </Popover>
    </div>
  },

  handlePopVisibleChange(popOpen){
    if (popOpen===true && this.state.searchText.trim().length === 0){
      //Don't anything if search Text is empty.
      return;
    }
    this.setState({popOpen});
  },

  handleSearch(event){
    let eventTarget = event.currentTarget;
    this.setState({searchText: event.target.value},
        function () {
          if (this.state.searchText.trim().length === 0) {//If no search text
            this.setState({searchResult: null, popOpen: false});
            return;
          }

          Meteor.call("searchApps", this.state.searchText.trim(), (error, searchResult)=> {
            if (error) {
              console.log("error", error);
              return;
            }
            let renderedResult = searchResult.map((app)=> {
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
                                       allCategories={this.props.allCategories}
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
        }.bind(this));
  }
});

module.exports = SearchBox;