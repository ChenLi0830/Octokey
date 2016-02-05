/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Create Category Button component, only available by admin user, called by "CatalogSideBar"
 *******************************************************************************/
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

    contextTypes:{
        intl: React.PropTypes.object.isRequired,
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
            alert(this.context.intl.messages.cata_createAppAlert);
        }
    },

    render(){
        const {messages} = this.context.intl;
        let categories = this.props.zenCategories.map(function (category) {
            return <MenuItem value={category.name} key={category._id}
                             primaryText={"\""+category.displayTitleChinese+"\""}/>
        }.bind(this));
        //console.log(categories);
        categories.push(<MenuItem value={"unchosen"} key={"lastItem"}
                                  primaryText={messages.cata_toBeSelected}/>);
        //console.log(categories);

        const actions = [
            <FlatButton
                label={messages.cata_cancel}
                secondary={true}
                onTouchTap={this.handleClose}/>,
            <FlatButton
                label={this.state.deleteCategoryIndex>-1 ? messages.cata_del
                :messages.cata_add}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.state.deleteCategoryIndex>-1 ? this.handleRemoveCategory:this.handleAddCategory}/>,
        ];

        let selectedDeleteCategory = this.state.deleteCategoryIndex > -1 ?
            this.props.zenCategories[this.state.deleteCategoryIndex].name : "unchosen";
        return <div style={{textAlign:"center"}}>
            <RaisedButton primary={true} label={messages.cata_editCategory} onTouchTap={this.handleOpen}
                          labelStyle={{color:"white"}}/>

                <Dialog
                    title={messages.cata_editCategory}
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}>
                    <h4>{messages.cata_del}</h4>
                    <DropDownMenu maxHeight={300}
                                  value={selectedDeleteCategory}
                                  onChange={this.handleRemoveChosen}>
                        {categories}
                    </DropDownMenu>
                    <Divider />
                    <h4>{messages.cata_add}</h4>
                    <br/>
                    <TextField hintText={messages.cata_symble}
                               disabled={this.state.deleteCategoryIndex>-1} ref="name"/>
                    <br/>
                    <TextField hintText={messages.cata_categoryNameCHS}
                               disabled={this.state.deleteCategoryIndex>-1} ref="displayTitleChinese"/>
                    <br/>
                    <TextField hintText={messages.cata_categoryNameEN}
                               disabled={this.state.deleteCategoryIndex>-1} ref="displayTitleEnglish"/>
                    <br/>
                    <TextField hintText={messages.cata_categoryPosition}
                               disabled={this.state.deleteCategoryIndex>-1} ref="index"/>
                </Dialog>
        </div>
    }
});