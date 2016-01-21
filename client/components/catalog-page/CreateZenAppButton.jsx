const {Button,
    Modal,
    Input,
    ButtonInput,
    Col,
    Image,
    Row
    } = ReactBootstrap;

const {
    RaisedButton,
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
    TableFooter,
    Divider
    } = MUI;

var selectedCategories = [0];

CreateZenAppButton = React.createClass({
    propTypes: {
        zenCategories: React.PropTypes.array.isRequired
    },

    getInitialState() {//for modal
        return {
            showModal: false,
            preview: "",
        };
    },

    close() {//for modal
        this.setState({
            showModal: false,
            preview: "",
        });
    },

    open() {//for modal
        this.setState({showModal: true});
    },


    render(){
        let button = (<div style={{textAlign:"center", padding:"10px 0 20px 0"}}>
            <RaisedButton label="创建Zen网签"
                          primary={true}
                          onClick={this.open}
                          labelStyle={{color:"white"}}/>
        </div>);

        let categoryTableRows = this.props.zenCategories.map(function (category) {
            return <TableRow key={category._id}
                             selectable={category.name!=="all"}
                             selected={category.name==="all"}>
                <TableRowColumn>{category.displayTitleChinese}</TableRowColumn>
            </TableRow>
        });

        return <div>
            {button}
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>"创建Zen网签"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handlePublicSubmit}>
                        <Input type="text" label="网站名" ref="appName" placeholder="例如: Google"/>
                        <Input type="text" label="登录链接" ref="loginLink" placeholder="例如: https://www.google.com/login"/>
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
                    <Button onClick={this.handlePublicSubmit}>创建</Button>
                </Modal.Footer>
            </Modal>
        </div>
    },

    onCellClick(rowNumber, columnId){
        var selectedIndex = selectedCategories.indexOf(rowNumber);
        if (selectedIndex > -1) {
            selectedCategories.splice(selectedIndex, 1);
        }
        else {
            selectedCategories.push(rowNumber);
        }
        //console.log("selectedCategories",selectedCategories);
    },


    handlePublicSubmit(event){
        event.preventDefault();

        var selectedCategoryNames = selectedCategories.map(function (categoryNum) {
            return this.props.zenCategories[categoryNum].name;
        }.bind(this));

        //console.log("selectedCategoryNames",selectedCategoryNames);
        const loginLink = this.refs.loginLink.refs.input.value;
        const appName = this.refs.appName.refs.input.value;

        if (loginLink && appName && this.state.preview !== "") {
            //Todo 显示等待条,或者其他gif
            console.log("this.state.preview", this.state.preview);
            Meteor.call("addZenApp", appName, loginLink, this.state.preview, selectedCategoryNames,
                function (error, result) {
                    if (error) {
                        throw new Meteor.Error(error);
                    }
                    this.close();
                }.bind(this));
        } else {
            alert("没填全");
        }
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
    }
});