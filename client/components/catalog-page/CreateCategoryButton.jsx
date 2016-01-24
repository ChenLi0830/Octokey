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
            deleteCategoryIndex: -1
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
            deleteCategoryIndex: -1
        })
    },

    handleRemoveChosen(e, index, value){
        const deleteCategoryIndex = (index === this.props.zenCategories.length) ? -1 : index;
        //console.log(this.props.zenCategories[index]._id);
        console.log("index", index, "deleteCategoryIndex", deleteCategoryIndex);
        this.setState({
            deleteCategoryIndex: deleteCategoryIndex
        });
        //console.log(this.props.zenCategories[this.state.deleteCategoryIndex].displayTitleChinese);
    },

    handleRemoveCategory(){
        let category = this.props.zenCategories[this.state.deleteCategoryIndex];
        //console.log("remove category:",category.displayTitleChinese, category._id);
        Meteor.call("removeCategory", category._id, function (error) {
            if (error) console.log("There is a error deleting category", error);
            this.handleClose();
        }.bind(this))
    },

    handleAddCategory(){
        let name = this.refs.name.getValue();
        let displayTitleChinese = this.refs.displayTitleChinese.getValue();
        let displayTitleEnglish = this.refs.displayTitleEnglish.getValue();
        let index = this.refs.index.getValue();
        if (name && displayTitleChinese && displayTitleEnglish && index) {
            Meteor.call("addNewCategory", name, displayTitleChinese, displayTitleEnglish, index, function (error) {
                this.handleClose();
            }.bind(this));
        } else {
            alert("几个都得填好,要不不给添");
        }
    },

    render(){
        let categories = this.props.zenCategories.map(function (category) {
            return <MenuItem value={category.name} key={category._id}
                             primaryText={"\""+category.displayTitleChinese+"\""}/>
        }.bind(this));
        //console.log(categories);
        categories.push(<MenuItem value={"unchosen"} key={"lastItem"} primaryText={"未选择"}/>);
        //console.log(categories);

        const actions = [
            <FlatButton
                label="取消"
                secondary={true}
                onTouchTap={this.handleClose}/>,
            <FlatButton
                label={this.state.deleteCategoryIndex>-1 ? "删除":"添加" }
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.state.deleteCategoryIndex>-1 ? this.handleRemoveCategory:this.handleAddCategory}/>,
        ];

        let selectedDeleteCategory = this.state.deleteCategoryIndex > -1 ?
            this.props.zenCategories[this.state.deleteCategoryIndex].name : "unchosen";
        return <div style={{textAlign:"center"}}>
            <RaisedButton primary={true} label="编辑类别" onTouchTap={this.handleOpen} labelStyle={{color:"white"}}/>
            <Dialog
                title="编辑类别:"
                actions={actions}
                modal={false}
                open={this.state.dialogOpen}
                onRequestClose={this.handleClose}>
                <h4>删除:</h4>
                <DropDownMenu maxHeight={300}
                              value={selectedDeleteCategory}
                              onChange={this.handleRemoveChosen}>
                    {categories}
                </DropDownMenu>
                <Divider />
                <h4>添加:</h4>
                <br/>
                <TextField hintText="name" disabled={this.state.deleteCategoryIndex>-1} ref="name"/>
                <br/>
                <TextField hintText="中文名" disabled={this.state.deleteCategoryIndex>-1} ref="displayTitleChinese"/>
                <br/>
                <TextField hintText="英文名" disabled={this.state.deleteCategoryIndex>-1} ref="displayTitleEnglish"/>
                <br/>
                <TextField hintText="位置(数字)" disabled={this.state.deleteCategoryIndex>-1} ref="index"/>
            </Dialog>
        </div>
    }
});