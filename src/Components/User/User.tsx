import { useState } from 'react'
import Profile from '../UserDashboard/Profile'
import Styles from './User.module.css'
import Booking from '../UserDashboard/Booking'


export default function User() {

    const [ optionSelected, setOptionSelected ] = useState<React.ReactNode>(Profile)

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.options}>
                <div className={Styles.optionsContainer}>
                    <img />
                    <button name='My profile' onClick={() => setOptionSelected(Profile)}> My Profile </button>
                </div>
                <div className={Styles.optionsContainer}>
                    <img />
                    <button name='Booking' onClick={() => setOptionSelected(Booking)}> Booking </button>
                </div>
            </div>
            <div className={Styles.optionSelected}>
                {optionSelected}
            </div>
        </div>
    )
}