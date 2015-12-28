CatalogSideBar = React.createClass({

  render(){
    return <div className="catalog-sidebar">
      <SearchBox/>
      <br/>
      <CreateAppDraft/>
      <br/>
      <CategoryList/>
    </div>
  }
});