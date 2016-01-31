/*AppLoading = React.createClass({
 render(){
 return (
 <div>
 App is loading.
 </div>
 )
 }
 });*/
const {RefreshIndicator,Paper  } = MUI;

AppLoading = React.createClass({
    render() {
        return <div>
            <Paper zDepth={1}
                   style={{backgroundColor:"#ffffff", boxShadow:"0 1px 6px rgba(0, 0, 0, 0.12)", padding:0, borderRadius:"5px"}}>
                <div className="horizontal-center" style={{width:"40px", padding:"40px"}}>
                    <RefreshIndicator size={40} left={0} top={5}
                                      style={{position:"relative"}}
                                      loadingColor={ZenColor.orange}
                                      status="loading"/>
                </div>
            </Paper>
        </div>
    }
});
//Todo change logo-zenid.svg


