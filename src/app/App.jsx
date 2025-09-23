import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css';
import Layout from './ui/Layout';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import AppContext from '../features/context/AppContext';
import { useEffect, useState } from 'react';
import Base64 from '../shared/base64/Base64';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token) ;
    console.log(u);
    setUser(u);
  }, [token]);

  return <AppContext.Provider value={ {message: "Hello from App", user, token, setToken} }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>      
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>;
}

export default App;
