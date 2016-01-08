/*AppLoading = React.createClass({
 render(){
 return (
 <div>
 App is loading.
 </div>
 )
 }
 });*/
const {RefreshIndicator  } = MUI;

AppLoading = React.createClass({
  render() {
    return <div className="horizontal-center" style={{width:"40px", padding:"40px"}}>
      <RefreshIndicator size={40} left={0} top={5}
                        style={{position:"relative"}}
                        loadingColor={ZenColor.orange}
                        status="loading"/>
    </div>
  }
});
//Todo change logo-zenid.svg


