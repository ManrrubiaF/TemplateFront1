import Styles from './Footer.module.css'
import { useAppSelector } from '../../Redux/Hooks'

export default function Footer() {
    const data = useAppSelector((state) => state.data)
    const facebook = data.socialLinks.find((link) => link.includes('facebook')) || null;
    const instagram = data.socialLinks.find((link) => link.includes('instagram')) || null;

    return (
        <div className={Styles.divMayor}>
            {data.phone && (
                <div className={Styles.socialContainer}>
                    <img src='src\assets\icons\call-32.png' alt='phone icon'> </img>
                    <span>{data.phone}</span>
                </div>
            )
            }
            {data.whatsapp && (
                <div className={Styles.socialContainer}>
                    <img src='src\assets\icons\whatsapp.svg' alt='whatsapp icon'> </img>
                    <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer">{data.whatsapp}</a>
                </div>
            )}
            {facebook && (
                <div className={Styles.socialContainer}>
                    <img src='src\assets\icons\facebook.svg' alt='Facebook icon'> </img>
                    <a href={facebook} target="_blank" rel="noopener noreferrer"> Empresa </a>
                </div>
            )
            }
            {instagram && (
                <div className={Styles.socialContainer}>
                    <img src='src\assets\icons\instagram.svg' alt='Instagram icon'> </img>
                    <a href={instagram} target="_blank" rel="noopener noreferrer"> Empresa </a>
                </div>
            )
            }
        </div>
    )
}