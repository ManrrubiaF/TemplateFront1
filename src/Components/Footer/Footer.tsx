import Styles from './Footer.module.css'
import { useAppSelector, useAppDispatch} from '../../Redux/Hooks'
import { useEffect } from 'react';
import { setData } from '../../Redux/Slice/contactSlice';
import axios from 'axios';




export default function Footer() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const data = useAppSelector((state) => state.data)
    const facebook = data.socialLinks?.find((link) => link.includes('facebook')) || null;
    const instagram = data.socialLinks?.find((link) => link.includes('instagram')) || null;   
    const dispatch = useAppDispatch()

    useEffect(() => {
        const hasInfo = Object.values(data).some(data => data === ("" || 0 || []))
        if(!hasInfo){
            getData();
        }            
    },[])


    const getData = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/data`)
            dispatch(setData(response.data))
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <div className={Styles.divMayor}>
            {data.phone && (
                <div className={Styles.socialContainer}>
                    <img src='/assets/icons/call-32.png' alt='phone icon' />
                    <span>{data.phone}</span>
                </div>
            )
            }
            {data.whatsapp && (
                <div className={Styles.socialContainer}>
                    <img src='/assets/icons/whatsapp.svg' alt='whatsapp icon' />
                    <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer">{data.whatsapp}</a>
                </div>
            )}
            {facebook && (
                <div className={Styles.socialContainer}>
                    <img src='/assets/icons/facebook.svg' alt='Facebook icon' />
                    <a href={facebook} target="_blank" rel="noopener noreferrer"> Empresa </a>
                </div>
            )
            }
            {instagram && (
                <div className={Styles.socialContainer}>
                    <img src='/assets/icons/instagram.svg' alt='Instagram icon' />
                    <a href={instagram} target="_blank" rel="noopener noreferrer"> Empresa </a>
                </div>
            )
            }
        </div>
    )
}