import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Styles from './Contact.module.css'

export default function ContactForm() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const maxCharCount = 1500;
    const [buttonState , setButtonState ] = useState(false);
    const [errors , setErrors ] = useState({
        name:'',
        email:'',
        text: ''
    })
    const [mailData, setMailData] = useState({
        name: '',
        email: '',
        text: '',
    })

    useEffect(()=>{
        const resultError = validation()
        setErrors(resultError)
        if (!Object.values(resultError).some(error => error !== "")) {            
            setButtonState(true);
        } else {
            setButtonState(false)
        }
    },[mailData])

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (event.target instanceof HTMLTextAreaElement) {
            if (value.length <= maxCharCount) {
                setMailData({
                    ...mailData,
                    [name]: value,
                });
            }
        } else if (event.target instanceof HTMLInputElement) {
            setMailData({
                ...mailData,
                [name]: value,
            });
        }

        validation();

    };

    const validation = () => {
        const error = {} as typeof errors;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (mailData.name.trim().length === 0 ) {
            error.name = "Name is required.";
        } else if (!/^([A-Za-z]+\s*)+$/.test(mailData.name)){
            error.name = "The name can only contain spaces and letters.";     
        }else{
            error.name = '';
        }
        if(mailData.text.trim().length < 50 ){
            error.text = "Minimun required is 50 characters";
        }else{
            error.text = '';
        }
        if(mailData.email.length < 3){
            error.email = " Mail is required"
        }else if(!emailRegex.test(mailData.email)){
            error.email = "Must be a valid email format"
        }else{
            error.email = '';
        }

        return error

    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BACK_URL}/data/mail`,mailData)
            toast.success(response.data)
            setMailData({
                name: '',
                email: '',
                text: ''
            })
            
        } catch (error:any) {
            toast.error(error.message)            
        }
    }

    return (
        <div className={Styles.divMayor}>
            <Toaster />
            <div className={Styles.h1container}>
                <h1>Please use the following form for suggestions and complaints</h1>
            </div>
            <form className={Styles.form} onSubmit={handleSubmit}>
                <div className={Styles.divForm}>
                    <label> Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={mailData.email}
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <label> {errors.email} </label>
                    )}
                </div>
                <div>
                    <label> Name: </label>
                    <input
                        type="text"
                        name="name"
                        min='4'
                        max='30'
                        value={mailData.name}
                        onChange={handleChange}
                    />
                    {errors.name && (
                        <label>{errors.name}</label>
                    )}
                </div>
                <div>
                    <textarea
                        name="text"
                        value={mailData.text}
                        onChange={handleChange}
                        maxLength={maxCharCount}
                    />
                    {errors.text && (
                        <label>{errors.text}</label>
                    )}
                    <p>
                        Characters remaining: {maxCharCount - mailData.text.length}/{maxCharCount}
                    </p>
                </div>
                {buttonState && (
                    <button type="submit">Submit</button>              
                )}
            </form>
        </div>
    )
}