import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'
import { resetUser, setUser } from "../../Redux/Slice/userSlice";
import { useEffect, useState } from "react";
import Styles from './Profile.module.css'

const BACK_URL = process.env.REACT_APP_BACK_URL;

interface UserData {
    id: number;
    name: string;
    lastName: string;
    phone: number;
    email: string;
    [key: string]: any;
}



export default function Profile() {
    const [isEditing, setEditing] = useState(false)
    const userData = useAppSelector((state) => state.user) as UserData || null;
    const dispatch = useAppDispatch()
    const [newData, setNewData] = useState<UserData>(userData)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const token: string | null = sessionStorage.getItem('token');
    const [showConfirmDialog, setConfirmDialog ] = useState(false)

    function deleteCookie() {
        document.cookie = token + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    useEffect(() => {
        setNewData(userData)
    }, [userData])

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${BACK_URL}/user`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            sessionStorage.removeItem('token')
            deleteCookie();
            dispatch(resetUser())
            setConfirmDialog(false)
            toast.success(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const deepEqual = () => {
        const keys = Object.keys(newData);

        for (const key of keys) {
            if (newData[key] !== userData[key]) {
                setButtonDisabled(false);
            } else {
                setButtonDisabled(true);
            }
        }
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewData(newData => ({
            ...newData,
            [name]: value
        }))

        deepEqual();

    }

    const handleCheckboxChange = () => {
        setEditing(!isEditing);
    }

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${BACK_URL}/user/update`, {
                headers: {
                    authorization: `Bearer ${token}`
                },
                newData
            })
            dispatch(setUser(response.data))

            toast.success('Data Updated');
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className={Styles.divMayor}>
            <Toaster />
            <label className={Styles.checkbox}>
                <input
                    type='checkbox'
                    name='edit'
                    checked={isEditing}
                    onChange={handleCheckboxChange}
                />
                Edit
            </label>
            <div className={Styles.dataContainer}>
                <span>Name</span>
                <input type="text" name='name' value={newData.name} readOnly={!isEditing} onChange={handleChange}></input>
            </div>
            <div className={Styles.dataContainer}>
                <span> LastName</span>
                <input type="text" name='lastName' value={newData.lastName} readOnly={!isEditing} onChange={handleChange}></input>
            </div>
            <div className={Styles.dataContainer}>
                <span> Email </span>
                <input type="email" name='email' value={newData.email} readOnly={!isEditing} onChange={handleChange}></input>
            </div>
            <div className={Styles.dataContainer}>
                <span> Phone </span>
                <input type="number" name='phone' value={newData.phone} readOnly={!isEditing} onChange={handleChange}></input>
            </div>
            <div className={Styles.buttonsContainer}>
                <button disabled={buttonDisabled} onClick={handleUpdate}> Save Changes </button>
                <button onClick={() => setConfirmDialog(!showConfirmDialog)}>Delete Account</button>
                {showConfirmDialog && (
                    <div className={Styles.divConfirmDialog}>
                        <h3>Do you want delete your account?</h3>
                        <div className={Styles.divConfirmButtons}>
                            <button onClick={handleDelete}>Yes</button>
                            <button onClick={()=> setConfirmDialog(!showConfirmDialog)}>No</button>
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
    )
}