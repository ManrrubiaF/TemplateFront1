import axios from "axios";
import Styles from './ProductDetail.module.css'
import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Hooks";
import { setCart } from "../../Redux/Slice/CartSlice";


interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    details: Detail[];
    category: string;
}

interface Detail {
    color: string;
    stock: number;
    image: string[];

}

export default function ProductDetail() {
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const dispatch = useAppDispatch()
    const { id } = useParams();
    const [showDetail, setShowDetail] = useState<Product>();
    const [detailSelected, setDetailSelected] = useState<Detail>({
        color: showDetail!.details[0].color,
        stock: showDetail!.details[0].stock,
        image: showDetail!.details[0].image,
    })
    const [ booking, setBooking ] = useState({
        productId: 0,
        color: '',
        stock: 0
    })

    const getProductDetail = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/product/${id}`)
            setShowDetail(response.data);

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getProductDetail();
    }, [])

    const handleColorChange = (event: ChangeEvent<HTMLSelectElement> ) => {
        const { value } = event.target;
        const currentDetail = showDetail?.details.find((detail)=> detail.color === value) as Detail;
        setDetailSelected(currentDetail)
    }

    const handleStockChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newstock = parseInt(event.target.value, 10);
        setBooking({
            productId: showDetail!.id,
            color: detailSelected.color,
            stock: newstock
        })
    }

    const handleAdd = () => {
        dispatch(setCart(booking))        
    }

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.containerImg}>
                <div className={Styles.carrouselContainer}>
                    <img src={detailSelected.image[0]} alt="Product Image" />
                </div>
                <h3>{showDetail?.name}</h3>
            </div>
            <div>
                <label> Colors: </label>
                <select value={detailSelected.color} name='color' onChange={handleColorChange}>
                    <option value="">Seleccionar color</option>
                    {showDetail?.details.map((detail) => (
                        <option key={detail.color} value={detail.color}>
                            {detail.color}
                        </option>
                    ))}
                </select>
                <label> Stock: {detailSelected.stock}</label>
                <input type="number" min='1' max={detailSelected.stock} name="stock" value={booking.stock} onChange={handleStockChange}/>

            </div>
            <div>
                <button onClick={handleAdd}> Add to Cart</button>
            </div>
        </div>
    )


}