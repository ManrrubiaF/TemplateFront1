import axios from "axios";
import { useAppDispatch } from "../../Redux/Hooks";
import { useAppSelector } from "../../Redux/Hooks";
import { setProducts } from "../../Redux/Slice/productSlice";
import Styles from './Products.module.css'
import { useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";

export default function Products() {
    const BACK_URL = process.env.REACT_APP_BACK_URL
    const dispatch = useAppDispatch()
    const productData = useAppSelector((state) => state.products)
    const { elementsPerPage, currentPage  } = useAppSelector((state) => state.pagination)
    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/product/active`)
            dispatch(setProducts(response.data))
        } catch (error) {
            console.error(error)
        }
    }

    const startIndex = (currentPage - 1) * elementsPerPage;
    const endIndex = currentPage * elementsPerPage;
    const productsOnPage = productData.slice(startIndex, endIndex);

    useEffect(() => {
        getProducts();
    }, [])

    const handleDetailClick = (id: number) => {
        navigate(`/product/${id}`)        
    }

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.carrouselContainer}>
                <div>
                    <label>The promotions carousel would go here </label>
                </div>
            </div>
            <div className={Styles.containerProducts}>
                <div className={Styles.filterDiv}>

                </div>
                <div className={Styles.productContainer}>
                    {productsOnPage.map((product) => (
                        <div className={Styles.oneProduct} key={product.id} onClick={() => handleDetailClick(product.id)}>
                            <div>
                                <img src={product.details[0]?.image[0]} alt="Product image" />
                            </div>
                            <label>{product.name}</label>
                            <label>{product.price}</label>
                        </div>
                    ))}
                </div>
            </div>
            <Pagination />
        </div>
    )
}