import Styles from './Admin.module.css'
import { useAppSelector } from '../../Redux/Hooks'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductsDashBoard from '../DashboardAdmin/Products/ProductsDashboard'
import BookingDashBoard from '../DashboardAdmin/Booking/BookingDashboard'
import toast, {Toaster} from 'react-hot-toast'
import CreateProduct from '../DashboardAdmin/CreateProduct/CreateProduct'
import ResumeDashBoard from '../DashboardAdmin/ResumeDashboard/ResumeDashboard'


export default function Admin() {
    const navigate = useNavigate()
    const accessStatus = useAppSelector((state) => state.user.User.access)
    const [optionSelected, setOptionSelected] = useState<string>('products')
    const [renderComponent, setRenderComponent] = useState<React.ReactNode>(null);

    useEffect(() => {
        if (accessStatus !== 'Admin') {
            toast.error(`You don't have access`)
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [])

    useEffect(() => {
        if (optionSelected === 'products') {
          setRenderComponent(< ProductsDashBoard />);
        } else if (optionSelected === 'bookings') {
          setRenderComponent(<BookingDashBoard />);
        } else if (optionSelected === 'Create') {
          setRenderComponent(<CreateProduct />);
        }else if(optionSelected === 'Resume'){
            setRenderComponent(<ResumeDashBoard />)
        } else {
          setRenderComponent(<div>No se seleccionó ninguna opción.</div>);
        }
      }, [optionSelected]);

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.buttonContainer}>
                <div className={Styles.optionsContainer}>
                    <button onClick={() => setOptionSelected('products')}> Products </button>
                </div>
                <div className={Styles.optionsContainer}>
                    <button onClick={() => setOptionSelected('bookings')}> Bookings </button>
                </div>
                <div className={Styles.optionsContainer}>
                    <button onClick={() => setOptionSelected('Create')}> Create Product </button>
                </div>
                <div className={Styles.optionsContainer}>
                    <button onClick={() => setOptionSelected('Resume')}> Resume </button>
                </div>
            </div>
            {renderComponent}
            <Toaster />
        </div>
    )
}