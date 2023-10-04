import axios from "axios";
import Styles from './Booking.module.css'
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../Redux/Hooks";
import toast, { Toaster } from "react-hot-toast";

interface Booking {
    id: number,
    userId: number,
    details: {
        productId: number;
        color: string;
        stock: number;
        status: string;
    }[]
}



export default function BookingDashBoard() {
    const products = useAppSelector((state) => state.products)
    const token: string | null = sessionStorage.getItem('token');
    const BACK_URL = process.env.REACT_APP_BACK_URL
    const [allBooking, setAllBooking] = useState<Booking[]>();
    const stockByProduct: Record<string, number> = {}


    useEffect(() => {
        getAllBookings();
    }, [])
    useEffect(() => {
        getTotals()
    }, [allBooking])

    const getAllBookings = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/booking/allbooking`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setAllBooking(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const getTotals = () => {
        allBooking?.forEach((booking) => {
            const bookingDetails = booking.details;

            bookingDetails.forEach((detail) => {
                const productId = detail.productId.toString();
                const stock = detail.stock;

                if (stockByProduct[productId]) {
                    stockByProduct[productId] += stock;
                } else {
                    stockByProduct[productId] = stock;
                }
            });
        });
    }

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.titlesContainer}>
                <label>Product Name</label>
                <label>Total Quantity Sold</label>
                <label>Total Price</label>
            </div>
            {allBooking && (
                Object.entries(stockByProduct).map(([productId, quantitySold])=> {
                    const product = products.find((oneProduct) => oneProduct.id === parseInt(productId))
                    
                    if(product) {
                        return  (
                            <div key={productId}>
                              <label>{product.name}</label>
                              <label>{quantitySold}</label>
                              <label>{quantitySold * parseFloat(product.price)}</label>
                            </div>
                          );
                        }
                })             
            )}
        </div>
    )

}
