import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import AppContext from '../features/context/AppContext';
import { useEffect, useRef, useState } from 'react';
import Base64 from '../shared/base64/Base64';
import Intro from '../pages/intro/Intro';
import Layout from './ui/layout/Layout';
import Group from '../pages/Group/Group';
import Cart from '../pages/cart/Cart';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [productGroups, setProductGroups] = useState([]);
  const [cart, setCart] = useState({cartItems:[]});
  const alarmRef = useRef();

  useEffect(() => {
    request("/api/product-group")
        .then(homePageData => setProductGroups(homePageData.productGroups));    
  }, []);

  const updateCart = () => {
    if(token != null) {
      request("/api/cart").then(data => {
        if(data != null) {
          setCart(data);
        }
      });
    }
    else {
      setCart({cartItems:[]});
    }
  };

  useEffect(() => {
    const u = token == null ? null : Base64.jwtDecodePayload(token) ;
    // console.log(u);
    setUser(u);
    updateCart();
  }, [token]);

  const request = (url, conf) => new Promise((resolve, reject) => {
    if(url.startsWith('/')) {
      url = "https://localhost:7229" + url;
      // автоматично підставляємо токен в усі запити
      // якщо він є і у запиті немає заголовка авторизації
      if(token) {
        if(typeof conf == 'undefined') {
          conf = {};
        }
        if(typeof conf.headers == 'undefined') {
          conf.headers = {};
        }
        if(typeof conf.headers['Authorization'] == 'undefined') {
          conf.headers['Authorization'] = "Bearer " + token;
        }
      }
    }
    fetch(url, conf)
      .then(r => r.json())
      .then(j => {
        if(j.status.isOk) {
          resolve(j.data);
        }
        else {
          console.error(j);
          reject(j);
        }
      });
  });

  const alarm = () => {
    alarmRef.current.click();
  };

  return <AppContext.Provider value={ {alarm, cart, request, updateCart, user, token, setToken, productGroups} }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="group/:slug" element={<Group />} />
          <Route path="intro" element={<Intro />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>      
      </Routes>
    </BrowserRouter>
    <i 
      style={{display: 'block', width:0, height: 0, position: 'absolute'}}
      ref={alarmRef} 
      data-bs-toggle="modal" 
      data-bs-target="#alarmModal"></i>
    <Alarm />
  </AppContext.Provider>;
}

function Alarm() {
  return <div className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="alarmModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>;
}

export default App;
/*
Д.З. Реалізувати роботу кнопки "Видалити весь кошик". 
Перед видаленням сформувати попередження 
"Ви підтверджуєте видалення кошику з 4 товарами на 1234 грн?"
(зауваження - сума кошику не є сумою товарів, а окремим полем)
*/