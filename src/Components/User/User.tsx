import Profile from '../UserDashboard/Profile'
import Styles from './User.module.css'
import Booking from '../UserDashboard/Booking'
import { useAppDispatch, useAppSelector } from '../../Redux/Hooks'
import { setOption } from '../../Redux/Slice/UserMenu'


export default function User() {

    const optionSelected = useAppSelector((state) => state.userMenu.option)
    const dispatch = useAppDispatch()    


    const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { name } = event.currentTarget
        if(name === 'Profile'){
            dispatch(setOption('Profile'))
        }else{
            dispatch(setOption('Booking'))
        }
    }

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.buttonContainer}>
                <div className={Styles.optionsContainer}>
                    <button name='Profile' onClick={handleChange}> My Profile </button>
                </div>
                <div className={Styles.optionsContainer}>
                    <button name='Booking' onClick={handleChange}> Booking </button>
                </div>
            </div>
            {optionSelected === 'Profile' ? (
                <Profile />
            ):(
                <Booking />
            )}

        </div>
    )
}