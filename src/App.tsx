import './App.css';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import Footer from './Components/Footer/Footer'
import NavBar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Admin from './Components/Admin/Admin'
import Products from './Components/Products/Products';
import ContactForm from './Components/Contact/Contact';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import User from './Components/User/User';
import FormRegister from './Components/FormRegister/FormRegister';
import { resetState } from './Redux/Slice/FilterSlice';
import { useAppDispatch } from './Redux/Hooks';
import DashboardProductDetail from './Components/DashboardAdmin/ProductDetail/ProductDetailsDashboard';

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  useEffect(() => {
    document.title = 'Template e-commerce3';

  }, []);
  useEffect(() => {
    const productRoutePattern = /^\/products(\/\d+)?/;
    if (location.pathname !== '/product' && !productRoutePattern.test(location.pathname)) {
      dispatch(resetState())
    }
  },[location])
  return (
    <div>
      < NavBar />
      <Routes>
        <Route path='/' element={<Home />} Component={Home} />
        <Route path='/someplace' element={<Admin />} Component={Admin} />
        <Route path='/products' element={<Products />} Component={Products} />
        <Route path='/products/:id' element={<ProductDetail />} Component={ProductDetail} />
        <Route path='/User' element={<User />} Component={User} />
        <Route path='/register' element={<FormRegister />} Component={FormRegister} />
        <Route path='/contact' element={<ContactForm />} Component={ContactForm} />
        <Route path='/someplace/detail/:id' element={<DashboardProductDetail />} Component={DashboardProductDetail} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

