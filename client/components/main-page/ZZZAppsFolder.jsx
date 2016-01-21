const {
    NavItem,
    Nav
    } = ReactBootstrap;

AppsFolder = React.createClass({
    render() {
        return (
            <Nav bsStyle="tabs" activeKey={1}>
                <NavItem eventKey={1} href="">NavItem 1 content</NavItem>
                <NavItem eventKey={2} title="">NavItem 2 content</NavItem>
                <NavItem eventKey={3} href="">NavItem 3 content</NavItem>
            </Nav>
        );
    }
});

