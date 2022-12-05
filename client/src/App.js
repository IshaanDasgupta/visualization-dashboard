import './App.css';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Dashboard from './Pages/Dashboard/DashBoard';
import './scss/index.scss';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
