import { BrowserRouter ,Routes, Route } from 'react-router-dom'
import { RequireToken, IsToken } from "./Auth";
import './App.css';
import ChatPage from './components/chatPage';
import Test from './components/test';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup'
import ContactForm from './components/Contact';
import Developer from './components/Developers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={LandingPage}/>
        <Route path="/test"  Component={Test}/>
      <Route path='/chat' element={
    <RequireToken>
      <ChatPage />
    </RequireToken>
  }/>
  <Route path='/login' element={
    <IsToken>
      <Login />
    </IsToken>
  }/>
   <Route path='/signup' element={
    <IsToken>
      <Signup />
    </IsToken>
  }/>
      {/* <Route path='/login' Component={Login}/>
      <Route path='/signup' Component={Signup}/> */}
      <Route path='/contact' Component={ContactForm}/>
      <Route path='/developer' Component={Developer}/>
      </Routes>
      </BrowserRouter>
    
  );
}

export default App;
