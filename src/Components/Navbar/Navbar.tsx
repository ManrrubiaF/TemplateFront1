import Styles from './Navbar.module.css'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../Redux/Hooks';
import axios from 'axios';
import { setUser } from '../../Redux/Slice/userSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { setStatus } from '../../Redux/Slice/CartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons'


export default function NavBar() {
    const [isLogged, setIsLogged] = useState(false)
    const [userMenuState, setUserMenuState] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const token: string | null = sessionStorage.getItem('token');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [documentClickHandlerAdded, setDocumentClickHandlerAdded] = useState(false);
    const userData = useAppSelector((state) => state.user);
    const statusCart = useAppSelector((state) => state.cart.cartStatus.status)
    const dispatch = useAppDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        email: '',
        pass: '',
    });
    const BACK_URL = process.env.REACT_APP_BACK_URL;

    const handleLoginClick = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCartClick = () => {
        dispatch(setStatus({ status: !statusCart }))
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

    useEffect(() => {
        if (userData) {
            setIsLogged(true);
        }
    }, [userData])

    useEffect(() => {
        if (userData) {
            setIsLogged(true);
        }
    }, [])

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${BACK_URL}/user`)
            dispatch(setUser(response.data))
            if (response.headers['set-cookie']) {
                sessionStorage.setItem('token', response.headers['set-cookie'][0]);
            }
            toast.success('Welcome')
        } catch (error: any) {
            toast.error(error.message)
        }
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };
    function deleteCookie() {
        document.cookie = token + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    const handleMenuClick = () => {
        setUserMenuState(!userMenuState);
    }


    const handleLogOut = async () => {
        try {
            const response = await axios.post(`${BACK_URL}/user/logout`, { token });
            sessionStorage.removeItem('token')
            deleteCookie();
            toast.success(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.divImg}>
                <img alt='Banner' src='' />
            </div>
            <div>
                <button onClick={() => navigate('/')}> About Us</button>
                <button onClick={() => navigate('/contact')}> Contact</button>
                {isLogged ? (
                    <React.Fragment>
                        <button onClick={handleMenuClick}> UserMenu</button>
                        {userMenuState && (
                            <div className={Styles.dropdown}>
                                <ul>
                                    <button onClick={() => navigate('/User')}> Profile </button>
                                    {userData.access === 'Admin' && (
                                        <button onClick={() => navigate('/someplace')}>Dashboard</button>
                                    )}
                                    <button onClick={handleLogOut}> LogOut </button>
                                </ul>
                            </div>
                        )}
                        {location.pathname === '/products' && (
                            <button onClick={handleCartClick}> Cart </button>
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <button onClick={handleLoginClick}> Login </button>
                        {isDropdownVisible && (
                            <div className={Styles.dropdown}>
                                <span>Email: </span>
                                <input
                                    type="text"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleInputChange}
                                />
                                <span>Contraseña: </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="pass"
                                    value={loginData.pass}
                                    onChange={handleInputChange}
                                />
                                {showPassword ? (
                                    <FontAwesomeIcon icon={faEyeSlash} style={{ color: "#000000", }} onClick={togglePasswordVisibility} />
                                ) : (
                                    <FontAwesomeIcon icon={faEye} style={{ color: "#000000", }} onClick={togglePasswordVisibility} />
                                )}

                                <button onClick={handleLogin}> Singin  </button>
                                <button onClick={() => navigate('/register')}> Singup </button>
                                <Toaster />
                            </div>
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}