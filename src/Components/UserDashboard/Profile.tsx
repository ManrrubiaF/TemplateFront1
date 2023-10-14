import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'
import { resetUser, setUser } from "../../Redux/Slice/userSlice";
import { useEffect, useState } from "react";
import { setIsEditing } from "../../Redux/Slice/userSlice";
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
    const isEditing = useAppSelector((state) => state.user.Editing.isEditing);
    const userData = useAppSelector((state) => state.user.User) as UserData || null;
    const dispatch = useAppDispatch()
    const [newData, setNewData] = useState<UserData>(userData)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const token: string | null = sessionStorage.getItem('token');
    const [showConfirmDialog, setConfirmDialog] = useState(false)

    useEffect(() => {
        setNewData(userData)
    }, [userData])

    useEffect(() => {
        const result = deepEqual();
        setButtonDisabled(!result);
    }, [newData, userData]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${BACK_URL}/user`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            sessionStorage.removeItem('token')
            dispatch(resetUser())
            toast.success(response.data)
            setConfirmDialog(false)            
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const deepEqual = () => {
        const keys = Object.keys(newData);

        let isDifferent = false;
        let i = 0;

        while (!isDifferent && i < keys.length) {
            const key = keys[i];

            if (newData[key] !== userData[key]) {
                isDifferent = true;
            }

            i++;
        }

        return isDifferent;
    }



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewData(newData => ({
            ...newData,
            [name]: value
        }))
    }

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${BACK_URL}/user/update`, newData, {
                headers: {
                    authorization: `Bearer ${token}`
                },

            })
            dispatch(setUser(response.data))
            setNewData(userData)
            toast.success('Data Updated');
            setButtonDisabled(true)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleChangeBox = () => {
        dispatch(setIsEditing(!isEditing))
    }

    return (
        <div className={Styles.divMayor}>
            <Toaster />
            <div>
                <label className={Styles.checkbox}>
                    Edit
                </label>
                <input
                    type='checkbox'
                    name='edit'
                    checked={isEditing}
                    onChange={handleChangeBox}
                />
            </div>
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
                <div>
                    <button disabled={buttonDisabled} onClick={handleUpdate} className={Styles.buttonUpdate}> Save Changes </button>
                    <button onClick={() => setConfirmDialog(!showConfirmDialog)} className={Styles.buttonDelete}>Delete Account</button>
                </div>
                {showConfirmDialog && (
                    <div className={Styles.divConfirmDialog}>
                        <h3>Do you want delete your account?</h3>
                        <div className={Styles.divConfirmButtons}>
                            <button onClick={handleDelete} className={Styles.buttonYes}>Yes</button>
                            <button onClick={() => setConfirmDialog(!showConfirmDialog) } className={Styles.buttonNo}>No</button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}