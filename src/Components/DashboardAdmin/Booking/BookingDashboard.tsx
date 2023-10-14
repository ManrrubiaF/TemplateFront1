import axios from "axios"
import Styles from './BookingDashboard.module.css'
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../Redux/Hooks";
import { setProducts } from "../../../Redux/Slice/productSlice";

interface Bookings {
    id: number;
    userId: number;
    details: {
        productId: number,
        color: string,
        stock: number,
    }[],
    status: string;
}

export default function Booking() {
    const token: string | null = sessionStorage.getItem('token');
    const [bookingData, setBookingData] = useState<Bookings[]>()
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const productData = useAppSelector((state) => state.products)
    const dispatch = useAppDispatch()



    useEffect(() => {
        if (productData.length < 1) {
            getProducts()
        }
        getBookingData();
    }, [])


    const getBookingData = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/booking/allbooking`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setBookingData(response.data);

        } catch (error) {
            console.error(error)
        }
    }


    const getProducts = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/product/active`)
            dispatch(setProducts(response.data));
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.divTitles}>
                <label> Product </label>
                <label> Color </label>
                <label> Stock </label>
                <label> Status </label>
            </div>
            {bookingData ? (
                bookingData?.map((booking) => (
                    <div key={booking.id} className={Styles.oneBooking}>
                        {booking.details.map((detail, index) => {
                            const product = productData.find((product) => product.id === detail.productId);
                            let productPhoto;
                            if (product) {
                                const productDetail = product.details.find((colorDetail) => colorDetail.color === detail.color)
                                productPhoto = productDetail?.image[0]
                            }
    
                            return (
                                    <div key={index} className={Styles.detailoneBooking}>{productPhoto && (
                                        <img src={productPhoto} alt={`Product ${detail.productId}`} />
                                    )}
                                        <p>{detail.color}</p>
                                        <p>{detail.stock}</p>
                                        <p>{booking.status}</p>
                                    </div>                          
                            )
                        }
                        )}
                    </div>
                ))
            ):(
                <div className={Styles.notBookings}>
                    <p>You dont have bookings</p>
                </div>
            )}
        </div>
    )
}