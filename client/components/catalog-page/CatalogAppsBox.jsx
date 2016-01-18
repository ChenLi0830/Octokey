const {
  Modal,
  Input,
  Button,
  Image,
  Panel,
  Row,
  Col,
  } = ReactBootstrap;

const {
  Paper,
  RaisedButton,
  List,
  TableRow,
  TableRowColumn,
  Table,
  TableHeader,
  TableHeaderColumn,
  TableBody
  } = MUI;

const MUITable = MUI.Table;

const {
  NavigationExpandMoreIcon
  } = SvgIcons;

let modalAttributes = {
  appName: "",
  loginLink: "",
  logoURL: "",
  selectedCategoryNames: [],
};

CatalogAppsBox = React.createClass({
  getInitialState(){
    return {
      showModal: false,
      preview: null,
      editAppId: null,
    }
  },

  close() {//for modal
    this.setState({
      showModal: false,
      preview: null,
      editAppId: null
    });

    modalAttributes = {
      appName: "",
      loginLink: "",
      logoURL: "",
      selectedCategoryNames: [],
    };
  },

  open() {//for modal
    this.setState({showModal: true});
  },

  propTypes: {
    zenApps: React.PropTypes.array.isRequired,
    zenCategories: React.PropTypes.array.isRequired
  },

  handleClick(appId, appName, loginLink, logoURL, selectedCategoryNames){
    this.setState({
      preview: logoURL,
      editAppId: appId
    });
    modalAttributes = {
      appName: appName,
      loginLink: loginLink,
      logoURL: logoURL,
      selectedCategoryNames: selectedCategoryNames,
    };
    //console.log("modalAttributes",modalAttributes);

    this.open();//open时会rerender modal里的值,把modalAttributes的值填进去
  },

  handleLogoUpload(){
    let logoFile = this.refs.logoFile.refs.input.files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
      this.setState({
        preview: reader.result
      });
    }.bind(this);

    reader.readAsDataURL(logoFile);
  },

  onCellClick(rowNumber, columnId){
    var selectedCategoryName = this.props.zenCategories[rowNumber].name;
    var index = modalAttributes.selectedCategoryNames.indexOf(selectedCategoryName);
    if (index > -1) {//already selected
      modalAttributes.selectedCategoryNames.splice(index, 1);
    }
    else {
      modalAttributes.selectedCategoryNames.push(selectedCategoryName);
    }
    console.log("modalAttributes.selectedCategoryNames", modalAttributes.selectedCategoryNames);
  },

  handleEditApp(event){
    event.preventDefault();
    //console.log("modalAttributes.selectedCategoryNames", modalAttributes.selectedCategoryNames);
    //console.log("this.state.preview", this.state.preview);
    const loginLink = this.refs.loginLink.refs.input.value;
    const appName = this.refs.appName.refs.input.value;

    if (loginLink && appName && this.state.preview !== "") {
      //Todo 显示等待条,或者其他gif
      Meteor.call("updateZenApp", this.state.editAppId, appName, loginLink, this.state.preview, modalAttributes.selectedCategoryNames,
        function (error, result) {
          if (error) {
            throw new Meteor.Error(error);
          }
          this.close();
        }.bind(this));
    } else {
      alert("没填全");
    }
    console.log("this.props.zenApps",this.props.zenApps);
  },

  handleRemoveApp(event){
    event.preventDefault();
    var delConfirm = confirm("你确定要删除吗?");
    if (delConfirm){
      Meteor.call("removeZenApp", this.state.editAppId, function (error, result) {
          if (error) {
            throw new Meteor.Error(error);
          }
          this.close();
        }.bind(this));
    }
  },

  render(){
    const publicApps = (this.props.zenApps.map(function (app) {
        let logoURL = getLogoUrl(app._id);
        return <CatelogSingleApp key={app._id}
                                 logoURL={logoURL}
                                 appName={app.appName}
                                 loginLink={app.loginLink}
                                 selectedCategoryNames={app.categoryNames}
                                 whenClicked={this.handleClick}
                                 appId={app._id}/>
      }.bind(this))
    );

    let categoryTableRows = this.state.showModal ?
      this.props.zenCategories.map(function (category, index) {
        const categorySelected = _.indexOf(modalAttributes.selectedCategoryNames, category.name) > -1;
        //console.log("categorySelected", categorySelected);
        //console.log("modalAttributes.selectedCategoryNames", modalAttributes.selectedCategoryNames);
        return <TableRow key={category._id}
                         selectable={category.name!=="all"}
                         selected={categorySelected}>
          <TableRowColumn>{category.displayTitleChinese}</TableRowColumn>
        </TableRow>
      }.bind(this)) : null;

    //Todo: create a new component to separate Modal from AppsBox, catalogAppsBox component is getting too bulky.
    return <div className="layout-margin">
      <Paper zDepth={1}
             style={{
             backgroundColor:"#ffffff",
             padding:0,
             borderRadius:"5px"}}>
        <List subheader="网站列表" style={{backgroundColor:"white"}}>
          {publicApps}
        </List>
      </Paper>

      <Modal show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>"编辑Zen网签"</Modal.Title>
          <Button onClick={this.handleRemoveApp}>删除网签</Button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handlePublicSubmit}>
            <Input type="text" label="网站名" ref="appName" placeholder="例如: Google"
                   defaultValue={modalAttributes.appName}/>
            <Input type="text" label="登录链接" ref="loginLink" placeholder="例如: https://www.google.com/login"
                   defaultValue={modalAttributes.loginLink}/>
            <Input type="file"
                   label="网站Logo"
                   ref="logoFile"
                   accept=".png, .jpg"
                   onChange={this.handleLogoUpload}
                   help=""/>
            <Row>
              <Col xs={6} md={4}>
                <Image ref="preview" src={this.state.preview} rounded/>
              </Col>
            </Row>

            <hr/>

            <Table
              height="200px"
              fixedHeader={true}
              fixedFooter={true}
              selectable={true}
              onCellClick={this.onCellClick}
              multiSelectable={true}>
              <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={{textAlign: 'center'}}>
                    选择类别
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                deselectOnClickaway={false}
                showRowHover={false}
                stripedRows={false}>

                {categoryTableRows}
              </TableBody>
            </Table>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleEditApp}>编辑</Button>
        </Modal.Footer>
      </Modal>
    </div>
  }
});