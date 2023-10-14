import Styles from './Navbar.module.css'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../Redux/Hooks';
import axios from 'axios';
import { resetUser, setUser } from '../../Redux/Slice/userSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetCart, setStatus } from '../../Redux/Slice/CartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { resetPagination } from '../../Redux/Slice/PaginationSlice';
import { setIsLogged, resetUserMenu } from '../../Redux/Slice/UserMenu';


export default function NavBar() {
    const isLogged = useAppSelector((state)=> state.userMenu.islogged)
    const [userMenuState, setUserMenuState] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const token: string | null = sessionStorage.getItem('token');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [documentClickHandlerAdded, setDocumentClickHandlerAdded] = useState(false);
    const userData = useAppSelector((state) => state.user.User) || null;
    const statusCart = useAppSelector((state) => state.cart.cartStatus.status)
    const dispatch = useAppDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        email: '',
        pass: '',
    });
    const BACK_URL = process.env.REACT_APP_BACK_URL;


    useEffect(() => {
        if (token && !isLogged) {
            dispatch(setIsLogged(true));
        }else{
            dispatch(setIsLogged(false));
        }
    }, [])
    useEffect(() => {
        if (token && !isLogged) {
            dispatch(setIsLogged(true));
        }
    }, [token])


    const handleLoginClick = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCartClick = () => {
        dispatch(setStatus(!statusCart))
    }

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && !target.closest(`.${Styles.menu}`)) {
                setUserMenuState(false);
            }
        };
        if (!documentClickHandlerAdded) {
            document.addEventListener('click', handleDocumentClick);
            setDocumentClickHandlerAdded(true);
        }

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [documentClickHandlerAdded]);


    const handleLogin = async () => {
        setDropdownVisible(false)
        try {
            const response = await axios.post(`${BACK_URL}/user/login` , loginData)
            dispatch(setUser(response.data.payload))
            toast.success('Welcome')
            window.sessionStorage.setItem("token",JSON.stringify(response.data.token))            
        } catch (error: any) {
            toast.error(error.response.data)
        }
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };
    
    const handleMenuClick = () => {
        setUserMenuState(!userMenuState);
    }


    const handleLogOut = async () => {
        setDropdownVisible(false)
        setUserMenuState(false)
        try {
            const response = await axios.post(`${BACK_URL}/user/logout`, {'token': token} );
            window.sessionStorage.removeItem('token')
            dispatch(resetUser());      
            dispatch(resetUserMenu());
            dispatch(resetCart());
            dispatch(setIsLogged(false));
            navigate('/')
            toast.success(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleProductsClick = () => {
        dispatch(resetPagination());
        navigate('/products')
    }

    const handleClickUser = () => {
        navigate('/user');
        setUserMenuState(false)
    }

    const handleClickDashboard = () => {
        navigate('someplace');
        setUserMenuState(false);
    }

    const handleSingUp = () => {
        setDropdownVisible(false)
        navigate('/register')
    }

    return (
        <nav className={Styles.divMayor}>
            <div className={Styles.divImg}>
                <img alt='Banner' src='https://res.cloudinary.com/drufv1rxz/image/upload/v1696482633/dfym6cgx7o3xtylsy6e2.jpg' />
            </div>
            <div className={Styles.buttonContainer}>
                <button className={Styles.defaultButton} onClick={() => navigate('/')}> About Us</button>
                <button className={Styles.defaultButton} onClick={() => navigate('/contact')}> Contact</button>
                <button className={Styles.defaultButton} onClick={handleProductsClick}> Products </button>
                {isLogged ? (
                    <React.Fragment>
                        <button className={Styles.buttonuser} onClick={handleMenuClick}> UserMenu</button>

                        {location.pathname === '/products' && (
                            <button onClick={handleCartClick}> Cart </button>
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <button className={Styles.buttonuser} onClick={handleLoginClick}> Login </button>

                    </React.Fragment>
                )}
            </div>
            {userMenuState && (
                <div className={Styles.dropdownMenu}>
                    <ul>
                        <button className={Styles.buttonsMenu} onClick={handleClickUser}> Profile </button>
                        {userData.access === 'Admin' && (
                            <button onClick={handleClickDashboard} className={Styles.buttonsMenu}>Dashboard</button>
                        )}
                        <button onClick={handleLogOut} className={Styles.buttonsMenu}> LogOut </button>
                    </ul>
                </div>
            )}
            {isDropdownVisible && (
                <div className={Styles.dropdown}>
                    <div className={Styles.inputContainer}>
                        <span>Email: </span>
                        <input
                            type="text"
                            name="email"
                            value={loginData.email}
                            onChange={handleInputChange}
                        />
                        <span>Password: </span>
                        <div className={Styles.password}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="pass"
                            value={loginData.pass}
                            onChange={handleInputChange}
                        />
                        {showPassword ? (
                            <FontAwesomeIcon icon={faEyeSlash} className={Styles.eyes} onClick={togglePasswordVisibility} />
                        ) : (
                            <FontAwesomeIcon icon={faEye} className={Styles.eyes} onClick={togglePasswordVisibility} />
                        )}
                        </div>
                    </div>
                    <div className={Styles.singupbuttons}>
                        <button onClick={handleLogin}> Singin  </button>
                        <button onClick={handleSingUp}> Singup </button>
                    </div>
                </div>
            )}
            <Toaster />
        </nav>
    )
}