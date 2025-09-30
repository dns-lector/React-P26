import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import AppContext from '../features/context/AppContext';
import { useEffect, useState } from 'react';
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

  return <AppContext.Provider value={ {cart, request, updateCart, user, token, setToken, productGroups} }>
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
  </AppContext.Provider>;
}

export default App;
/*
Д.З. Реалізувати повідомлення про додавання товару. 
"Товар додано до кошику. Перейти до кошику?" 
** + дві кнопки: "до кошику" та "продовжити покупки"
А також про помилки, якщо такі виникають
Також додати повідомлення про необхідність автентифікації
при спробі додавати товар в неавторизованому режимі
*/