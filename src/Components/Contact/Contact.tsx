import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState, ChangeEvent, FormEvent } from "react";
import Styles from './Contact.module.css'

export default function ContactForm() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const maxCharCount = 300;
    const [mailData, setMailData] = useState({
        name: '',
        email: '',
        text: '',
    })

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

    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BACK_URL}/data/mail`,mailData)
            setMailData({
                name: '',
                email: '',
                text: ''
            })
            toast.success(response.data)
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label> Email: </label>
                    <input
                        type="email"
                        name="email"
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        value={mailData.email}
                        onChange={handleChange}
                    />
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
                </div>
                <div>
                    <textarea
                        name="text"
                        value={mailData.text}
                        onChange={handleChange}
                        maxLength={maxCharCount}
                    />
                    <p>
                        Characters remaining: {maxCharCount - mailData.text.length}/{maxCharCount}
                    </p>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}