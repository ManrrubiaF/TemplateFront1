import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'
import Styles from './FormRegister.module.css'
import { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch } from "../../Redux/Hooks";
import { setUser } from "../../Redux/Slice/userSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function FormRegister() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const dispatch = useAppDispatch()
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        pass: '',
        name: '',
        lastName: '',
        phone: '',
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BACK_URL}/user/create`, userData);
            dispatch(setUser(response.data))
            if (response.headers['set-cookie']) {
                sessionStorage.setItem('token', response.headers['set-cookie'][0]);
            }
            toast.success('Welcome')

        } catch (error: any) {
            toast.error(error.message)
        }
    };

    return (
        <div className={Styles.divMayor}>
            <Toaster />
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={userData.pass}
                        onChange={handleChange}
                    />
                    {showPassword ? (
                       <FontAwesomeIcon icon={faEyeSlash} style={{color: "#000000",}} onClick={togglePasswordVisibility} /> 
                    ):(
                        <FontAwesomeIcon icon={faEye} style={{color: "#000000",}} onClick={togglePasswordVisibility}/>
                    )}
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="number"
                        name="phone"
                        pattern="[0-9]{10}"
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}