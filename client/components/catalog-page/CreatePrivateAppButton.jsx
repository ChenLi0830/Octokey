const {Button,
    Modal,
    Input,
    ButtonInput,
    Col,
    Image,
    Row
    } = ReactBootstrap;

const {RaisedButton} = MUI;

const {FormattedMessage} = ReactIntl;

CreatePrivateAppButton = React.createClass({

    getInitialState() {//for modal
        return {
            showModal: false,
            preview: ""
        };
    },

    close() {//for modal
        this.setState({showModal: false});
    },

    open() {//for modal
        this.setState({showModal: true});
        alert("not finished yet :D");
    },

    render(){
        let button = (<div style={{textAlign:"center", padding:"10px 0 30px 0"}}>
            <p>{<FormattedMessage id="cata_createPrivateMessage"/>}</p>
            <RaisedButton label={<FormattedMessage id="cata_createPrivateBtn"/>}
                          secondary={true}
                          onClick={this.open}
                          labelStyle={{color:"white"}}/>
        </div>);

        return <div>
            {button}
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{<FormattedMessage id="cata_createPrivateBtn"/>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handlePrivateSubmit}>
                        <FormattedMessage id="cata_namePlaceHolder">
                            {(formattedValue)=>(
                                <Input type="text" label={<FormattedMessage id="cata_appName"/>} ref="appName"
                                       placeholder={formattedValue}/>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="cata_linkPlaceHolder">
                            {(formattedValue)=>(
                                <Input type="text" label={<FormattedMessage id="cata_appLoginLink"/>} ref="loginLink"
                                       placeholder={formattedValue}/>
                            )}
                        </FormattedMessage>

                        <Input type="file"
                               label={<FormattedMessage id="cata_appLogo"/>}
                               ref="logoFile"
                               accept=".png, .jpg"
                               onChange={this.handleLogoUpload}
                               help=""/>
                        <Row>
                            <Col xs={6} md={4}>
                                <Image ref="preview" src={this.state.preview} rounded/>
                            </Col>
                        </Row>

                        <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                        <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

                        <div>
                            <Input type="text" label={<FormattedMessage id="cata_username"/>} ref="username"/>
                            <Input type="password" label={<FormattedMessage id="cata_password"/>} ref="password"/>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" onClick={this.handlePrivateSubmit}><FormattedMessage id="cata_createBtn"/></Button>
                </Modal.Footer>
            </Modal>
        </div>
    },

    handlePrivateSubmit(event){
        event.preventDefault();
        //Todo: implement this function
        alert("A private app is submitted. It should be added to the private app collection.");
        this.close();
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