import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'
import Styles from './FormRegister.module.css'
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAppDispatch } from "../../Redux/Hooks";
import { setUser } from "../../Redux/Slice/userSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";

export default function FormRegister() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [buttonState, setButtonState] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        pass: '',
        name: '',
        lastName: '',
        phone: '',
    })
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

    const validation = () => {
        const error = {} as typeof errors;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (userData.email.length < 3) {
            error.email = " Mail is required"
        } else if (!emailRegex.test(userData.email)) {
            error.email = "Must be a valid email format"
        }
        if (userData.name.trim().length < 4) {
            error.name = "Name is required.";
        } else if (!/^([A-Za-z]+\s*)+$/.test(userData.name)) {
            error.name = "The name can only contain spaces and letters.";
        }
        if (userData.lastName.trim().length < 4) {
            error.lastName = "Lastname is required"
        }
        if (userData.phone.length < 1) {
            error.phone = "Phone number must be 10 digits.";
        }else if ( userData.phone.length !== 10 || !/^\d+$/.test(userData.phone)) {
            error.phone = "Phone number must only contain 10 digits";
        }
        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-_.])/.test(userData.pass)) {
            error.pass =
                "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 of the following special characters: . - _ and greater than 8";
        } else if (userData.pass.length < 8) {
            error.pass = "Password is required.";
        }

        return error;

    }

    useEffect(() => {
        const resultError = validation();
        setErrors(resultError);
        if (!Object.values(resultError).some(error => error !== "")) {
            setButtonState(true);
        } else {
            setButtonState(false)
        }

    }, [userData])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${BACK_URL}/user/create`, userData);
            dispatch(setUser(response.data.payload))
            window.sessionStorage.setItem("token",JSON.stringify(response.data.token))
            toast.success('Welcome')
            navigate(-1)

        } catch (error: any) {
            toast.error(error.response.data)
        }
    };

    return (
        <div className={Styles.divMayor}>
            <Toaster />

            <form className={Styles.form} onSubmit={handleSubmit}>
                <div>
                    <h2> SingUp Form </h2>
                </div>
                <div className={Styles.divLabel}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                    <label className={Styles.error}>{errors.email}</label>
                </div>
                <div className={Styles.divLabel}>
                    <label>Password:</label>
                    <div className={Styles.inputPass}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="pass"
                            value={userData.pass}
                            onChange={handleChange}
                        />
                        {showPassword ? (
                            <FontAwesomeIcon icon={faEyeSlash} style={{ color: "#000000", }} onClick={togglePasswordVisibility} />
                        ) : (
                            <FontAwesomeIcon icon={faEye} style={{ color: "#000000", }} onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    {errors.pass && (
                        <label className={Styles.error}>{errors.pass}</label>
                    )}
                </div>
                <div className={Styles.divLabel}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                    />
                    {errors.name && (
                        <label className={Styles.error}>{errors.name}</label>
                    )}
                </div>
                <div className={Styles.divLabel}>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && (
                        <label className={Styles.error}> {errors.lastName}</label>
                    )}
                </div>
                <div className={Styles.divLabel}>
                    <label>Phone:</label>
                    <input
                        type="number"
                        name="phone"
                        step="0.01"
                        value={userData.phone}
                        onChange={handleChange}

                    />
                    {errors.phone && (
                        <label className={Styles.error}>{errors.phone}</label>
                    )}
                </div>
                {buttonState && (
                    <button type="submit">Submit</button>
                )}
            </form>
        </div>
    )
}