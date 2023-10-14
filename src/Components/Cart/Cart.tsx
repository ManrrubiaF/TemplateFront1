import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Styles from './Cart.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { resetCart, removeProductFromCart, setStatus } from "../../Redux/Slice/CartSlice";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";

interface Booking {
    productId: number | undefined;
    color: string | undefined;
    stock: number | undefined;
}

interface Product {
    id: number;
    price: string;
    description: string;
    active: boolean;
    details: Detail[];

}

interface Detail {
    color: string;
    stock: number;
    image: string[];
}

export default function Cart() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const dispatch = useAppDispatch()
    const token: string | null = sessionStorage.getItem('token');
    const bookingData = useAppSelector((state) => state.cart.cart.details)
    const products = useAppSelector((state) => state.products)

    const handleClick = async () => {
        try {
            const response = await axios.post(`${BACK_URL}/booking/create`, bookingData, {
                headers: {
                    authorization: `Bearer ${token}`
                },                
            })
            dispatch(resetCart())
            toast.success(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleDelete = (index: number) => {
        dispatch(removeProductFromCart(index))
    }

    const handleClose = () => {
        dispatch(setStatus(false))
    }

    function calculateTotalPrice(bookingData: Booking[], products: Product[]): number {
        let totalPrice = 0;
        bookingData.forEach((oneBooking) => {
            const product = products.find((oneProduct) => oneProduct.id === oneBooking.productId);
            if (product && product.price && oneBooking.stock) {
                totalPrice += parseFloat(product.price) * oneBooking.stock;
            }
        });
        return totalPrice;
    }


    return (
        <div className={Styles.divMayor}>
            <button className={Styles.buttonClose} onClick={handleClose}> X </button>
            <Toaster />
            <div className={Styles.cartBar}>
                <label> Product </label>
                <label> Unit Price </label>
                <label> Total Price</label>
            </div>
            {bookingData.length > 0 ? (
                <div className={Styles.detailsContainer}>
                    {bookingData.map((oneBooking, index) => {
                        const product = products.find((oneProduct) => oneProduct.id === oneBooking.productId)
                        const photo = product?.details.find((oneDetail) => oneDetail.color === oneBooking.color)
                        let totalprice;
                        if (product && product.price && oneBooking.stock) {
                            totalprice = parseFloat(product.price) * oneBooking.stock;
                        }
                        return (
                            <div key={index} className={Styles.ShowOne}>
                                <div className={Styles.imgAndStockDiv}>
                                    <img src={photo?.image[0]} />
                                    <label>{oneBooking.stock && oneBooking.stock < 2 ? `${oneBooking.stock} unit` : `${oneBooking.stock} units`}</label>
                                </div>
                                <div>
                                    <label>{product?.price}</label>
                                </div>
                                <div >
                                    <label>{totalprice}</label>
                                </div>
                                <FontAwesomeIcon icon={faX} className={Styles.iconX} onClick={() => handleDelete(index)} />
                            </div>
                        )
                    }
                    )}
                </div>
            ) : (
                <div>
                    <p> No products have been added</p>
                </div>
            )}
            {bookingData.length > 0 && (
                <div className={Styles.footerCart}>
                    <div className={Styles.totalPriceContainer}>
                        <label>Total CheckOut: {calculateTotalPrice(bookingData, products)}</label>
                    </div>
                    <div>
                        <button onClick={handleClick}>CheckOut</button>
                    </div>
                </div>
            )}

        </div>
    )
}