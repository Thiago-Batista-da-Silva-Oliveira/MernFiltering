import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import BootcampsPage from './pages/BootcampsPage'
import Navbar from './components/Navbar'
function App() {
  return (
   <>
   <Router>
     <Navbar />
     <Switch>
       <Route exact path="/" component={BootcampsPage} />
     </Switch>
   </Router>
   </>
  );
}

export default App;
