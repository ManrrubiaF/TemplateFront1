import Styles from './Admin.module.css'
import { useAppSelector } from '../../Redux/Hooks'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Admin() {
    const navigate = useNavigate()
    const accessStatus = useAppSelector((state) => state.user.access)
    const [optionSelected, setOptionSelected] = useState<React.ReactNode>()

    useEffect(() => {
        if (accessStatus !== 'Admin') {
            navigate('/')
        }
    }, [])

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.Options}>
                <div>
                    <button onClick={() => setOptionSelected('products')}> Products </button>
                </div>
                <div>
                    <button onClick={() => setOptionSelected('bookings')}> Bookings </button>
                </div>
            </div>
            {optionSelected}
        </div>
    )
}