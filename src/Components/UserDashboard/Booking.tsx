import axios from "axios"
import Styles from './Booking.module.css'
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import toast, { Toaster } from "react-hot-toast";
import { faX, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setProducts } from "../../Redux/Slice/productSlice";

interface Booking {
    id: number;
    userId: number;
    details: {
        productId: number,
        color: string,
        stock: number,
        status: string;
    }[]
}

export default function Booking() {
    const token: string | null = sessionStorage.getItem('token');
    const [bookingData, setBookingData] = useState<Booking[]>()
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const productData = useAppSelector((state) => state.products)
    const [dataUpdated, setDataUpdated] = useState(false)
    const dispatch = useAppDispatch()
    const [newData, setNewData] = useState({
        id: 0,
        status: ''
    })

    const getBookingData = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/booking/mybooking`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setBookingData(response.data);

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        updateBookingData();
    }, [newData])

    const updateBookingData = async () => {
        try {
            const response = await axios.put(`${BACK_URL}/booking/update`, {
                headers: {
                    authorization: `Bearer ${token}`
                },
                newData
            });
            setDataUpdated(!dataUpdated)
            toast.success(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleCancel = (booking: Booking) => {
        const shouldCancel = window.confirm("Do you really want cancel this product?");
        if (shouldCancel) {
            setNewData({ id: booking.id, status: 'cancel' });
        }
    }

    const handleDelete = (booking: Booking) => {
        const shouldCancel = window.confirm("Do you really want delete this product?");
        if (shouldCancel) {
            setNewData({ id: booking.id, status: 'deleted' })
        }
    }

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/products/active`)
            dispatch(setProducts(response.data));            
        } catch (error) {
            console.error(error)            
        }        
    }

    useEffect(() => {
        if(productData.length < 1){
            getProducts()
        }
        getBookingData();
    }, [])
    useEffect(() => {
        getBookingData()
    }, [dataUpdated])

    return (
        <div className={Styles.divMayor}>
            <Toaster />
            <div className={Styles.divTitles}>
                <label> Product </label>
                <label> Color </label>
                <label> Stock </label>
                <label> Status </label>
                <label> Cancel </label>
                <label> Delete </label>
            </div>
            {bookingData?.map((booking) => (
                <div key={booking.id}>
                    {booking.details.map((detail, index) => {
                        const product = productData.find((product) => product.id === detail.productId);
                        let productPhoto;
                        if (product) {
                            const productDetail = product.details.find((colorDetail) => colorDetail.color === detail.color)
                            productPhoto = productDetail?.image[0]
                        }

                        return (
                            <div key={index}>
                                {productPhoto && (
                                    <img src={productPhoto} alt={`Product ${detail.productId}`} />
                                )}
                                <p>{detail.color}</p>
                                <p>{detail.stock}</p>
                                <p>{detail.status}</p>
                                {detail.status !== 'cancel' && (
                                    <FontAwesomeIcon icon={faX} style={{ color: "#e74b08" }} onClick={() => handleCancel(booking)} />
                                )}
                                {detail.status === 'cancel' && (
                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#496204" }} onClick={() => handleDelete(booking)} />
                                )}
                            </div>
                        )
                    }
                    )}
                </div>
            ))}
        </div>
    )
}