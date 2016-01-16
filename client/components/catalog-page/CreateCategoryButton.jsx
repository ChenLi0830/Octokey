const {
  FlatButton,
  RaisedButton,
  Dialog,
  MenuItem,
  DropDownMenu,
  TextField,
  Divider,
  } = MUI;

CreateCategoryButton = React.createClass({
  propTypes: {
    zenCategories: React.PropTypes.array.isRequired
  },

  getInitialState(){
    return {
      dialogOpen: false,
      deleteCategoryName: null
    }
  },

  handleOpen(){
    this.setState({
      dialogOpen: true
    })
  },

  handleClose(){
    this.setState({
      dialogOpen: false,
      deleteCategoryName: null
    })
  },

  handleRemoveChosen(e, index, value){
    const deleteCategoryName = (value === "unchosen") ? null : value;
    this.setState({
      deleteCategoryName: deleteCategoryName
    })
  },

  handleRemoveCategory(){
    Meteor.call("removeCategory",this.state.deleteCategoryName, function(error){
      this.handleClose();
    }.bind(this))
  },

  handleAddCategory(){
    let name = this.refs.name.getValue();
    let displayTitleChinese = this.refs.displayTitleChinese.getValue();
    let displayTitleEnglish = this.refs.displayTitleEnglish.getValue();
    Meteor.call("addNewCategory",name,displayTitleChinese,displayTitleEnglish, function(error){
      this.handleClose();
    }.bind(this));
  },

  render(){
    let categories = this.props.zenCategories.map(function (category) {
      return <MenuItem value={category.name} key={category._id} primaryText={"\""+category.displayTitleChinese+"\""}/>
    }.bind(this));
    //console.log(categories);
    categories.push(<MenuItem value={"unchosen"} key={0} primaryText={"未选择"}/>);
    //console.log(categories);

    const actions = [
      <FlatButton
        label="取消"
        secondary={true}
        onTouchTap={this.handleClose}/>,
      <FlatButton
        label={this.state.deleteCategoryName ? "删除":"添加" }
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.state.deleteCategoryName ? this.handleRemoveCategory:this.handleAddCategory}/>,
    ];

    return <div style={{textAlign:"center"}}>
      <RaisedButton primary={true} label="编辑类别" onTouchTap={this.handleOpen} labelStyle={{color:"white"}}/>
      <Dialog
        title="编辑类别:"
        actions={actions}
        modal={false}
        open={this.state.dialogOpen}
        onRequestClose={this.handleClose}>
        删除:
        <DropDownMenu maxHeight={300} value={this.state.deleteCategoryName?this.state.deleteCategoryName:"unchosen"}
                      onChange={this.handleRemoveChosen}>
          {categories}
        </DropDownMenu>
        <Divider />
        添加:
        <br/>
        <TextField hintText="name" disabled={!!this.state.deleteCategoryName} ref="name"/>
        <br/>
        <TextField hintText="displayTitleChinese" disabled={!!this.state.deleteCategoryName} ref="displayTitleChinese"/>
        <br/>
        <TextField hintText="displayTitleEnglish" disabled={!!this.state.deleteCategoryName} ref="displayTitleEnglish"/>

      </Dialog>
    </div>
  }
});