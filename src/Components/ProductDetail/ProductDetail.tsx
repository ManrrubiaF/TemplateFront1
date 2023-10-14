import axios from "axios";
import Styles from './ProductDetail.module.css'
import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/Hooks";
import { setCart } from "../../Redux/Slice/CartSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";



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
    const FRONT_URL = process.env.REACT_APP_FRONT_URL;
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { id } = useParams();
    const data = useAppSelector((state) => state.data);
    const isLogged = useAppSelector((state)=> state.userMenu.islogged)
    const [showDetail, setShowDetail] = useState<Product>();
    const [detailSelected, setDetailSelected] = useState<Detail>()
    const [currentImage, setCurrentImage] = useState(0);
    const [booking, setBooking] = useState({
        productId: 0,
        color: "",
        stock: 1,
    })
    const whatsappText = `Hi, i'm interested in this product. ${FRONT_URL}/products/${id} in color ${detailSelected?.color} `;
    




    const nextImage = () => {
        setCurrentImage((prevImage) => (prevImage + 1) % detailSelected!.image.length);
    };

    const prevImage = () => {
        setCurrentImage((prevImage) => (prevImage - 1 + detailSelected!.image.length) % detailSelected!.image.length);
    };

    const getProductDetail = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/product/${id}`)
            setShowDetail(response.data);
            setDetailSelected({
                color: response.data.details[0].color,
                stock: response.data.details[0].stock,
                image: response.data.details[0].image,
            })
            setBooking({
                productId: response.data.id,
                color: response.data.details[0].color,
                stock: 1,
            })

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getProductDetail();
    }, [])

    const handleColorChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        const currentDetail = showDetail?.details.find((detail) => detail.color === value) as Detail;
        setDetailSelected(currentDetail)
    }

    const handleStockChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newstock = parseInt(event.target.value, 10);
        setBooking({
            productId: showDetail!.id,
            color: detailSelected!.color,
            stock: newstock
        })
    }
    const handleAdd = () => {
        dispatch(setCart(booking));
        toast.success('Product added');
        setBooking({
            productId: showDetail?.id || 0,
            color: "",
            stock: 1
        })

    }

    return (
        <div className={Styles.divMayor}>
            {detailSelected && (
                <div className={Styles.containerAll}>
                    <div className={Styles.containerImg}>
                        {detailSelected!.image.length > 1 ? (
                            <div className={Styles.buttonandCarrousel}>
                                <button className={Styles.prevButton} onClick={prevImage}>{"<<"}</button>
                                <img className={Styles.showImg} src={detailSelected!.image[currentImage]} alt="Product Image" />
                                <button className={Styles.nextButton} onClick={nextImage}>{">>"}</button>
                            </div>
                        ) : (
                            <div className={Styles.oneImg} >
                                <img className={Styles.showImg} src={detailSelected!.image[0]} alt="Product Image" />
                            </div>
                        )}
                        <div className={Styles.divWhatsapp}>
                            {isLogged && (
                                <button className={Styles.addbutton} onClick={handleAdd}> Add to Cart</button>
                            )}
                            <img src='/assets/icons/whatsapp.svg' alt='whatsapp icon' />
                            <a href={`https://wa.me/${data.whatsapp}/?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">Ask about this product</a>
                        </div>
                        
                    </div>

                    <div className={Styles.details}>
                        <h3>{showDetail?.name}</h3>
                        <p>{showDetail?.description}</p>
                        <label> Colors: </label>
                        <select value={detailSelected!.color} name='color' onChange={handleColorChange}>
                            <option value="" disabled selected>Seleccionar color</option>
                            {showDetail?.details.map((detail, index) => (
                                <option key={index} value={detail.color}>
                                    {detail.color}
                                </option>
                            ))}
                        </select>
                        <label> Stock: {detailSelected!.stock}</label>
                        <input type="number" min='1' max={detailSelected!.stock} name="stock" value={booking.stock} onChange={handleStockChange} />
                        <Toaster />
                        <button className={Styles.backButton} onClick={()=> navigate(-1)}> Back </button>
                    </div>
                </div>
            )}
        </div>
    )


}