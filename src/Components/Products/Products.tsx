import axios from "axios";
import { useAppDispatch } from "../../Redux/Hooks";
import { useAppSelector } from "../../Redux/Hooks";
import { setProducts } from "../../Redux/Slice/productSlice";
import Styles from './Products.module.css'
import { useEffect, ChangeEvent, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Cart from "../Cart/Cart";
import { setCategory, setOrder, resetState } from "../../Redux/Slice/FilterSlice";

type Product = {
    id: number;
    name: string;
    price: string;
    description: string;
    category: string;
    active: boolean;
    details: Detail[]
}

type Detail = {
    color:string;
    stock:number;
    image:string[]
}

export default function Products() {
    const BACK_URL = process.env.REACT_APP_BACK_URL
    const dispatch = useAppDispatch()
    const cartStatus = useAppSelector((state) => state.cart.cartStatus.status)
    const productData = useAppSelector((state) => state.products)
    const { elementsPerPage, currentPage } = useAppSelector((state) => state.pagination)
    const filter = useAppSelector((state) => state.filter)
    const navigate = useNavigate();
    const [allProduct , setAllProduct ] = useState<Product[]>([])
    const categories = [...new Set(allProduct.map(product => product.category))]
    

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/product/active`)
            dispatch(setProducts(response.data))
            setAllProduct(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleFilters = () => {
        let products: Product[] = productData.slice();

        if (filter.category !== '') {
            products = allProduct.filter(oneProduct => oneProduct.category === filter.category);
        }

        if (filter.order === 'Ascending') {
            products = sortByAscendingPrice(products);
        } else if (filter.order === 'Descending') {
            products = sortByDescendingPrice(products);
        }
        dispatch(setProducts(products));
    };

    const handleClear = () => {
        dispatch(resetState());
        if(allProduct?.length > 0){
            dispatch(setProducts(allProduct))
        }
    }

    const sortByAscendingPrice = (products: Product[]) => {
        return products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    };

    const sortByDescendingPrice = (products: Product[]) => {
        return products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    };


    const startIndex = (currentPage - 1) * elementsPerPage;
    const endIndex = currentPage * elementsPerPage;
    const productsOnPage = productData.slice(startIndex, endIndex);

    useEffect(() => {
        getProducts()
    }, [])
    useEffect(() => {
        handleFilters();
    }, [filter.category, filter.order])


    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        dispatch(setCategory(value))

    }
    const handleOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        dispatch(setOrder(value));

    }

    const handleDetailClick = (id: number) => {
        navigate(`/products/${id}`)
    }

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.carrouselContainer}>
                <label>The promotions carousel would go here </label>
            </div>
            <div className={Styles.filterDiv}>
                <select name="order" onChange={handleOrderChange} value={filter.order}>
                    <option value="" disabled >Select Price Order</option>
                    <option value="Ascending">Ascending (From low to high) </option>
                    <option value="Descending">Descending (From high to low)</option>
                </select>
                <select name="Category" onChange={handleCategoryChange} value={filter.category}>
                    <option value="" disabled > Select Category </option>
                    {categories && (
                        categories.map((oneCategory, index) => (
                            <option key={index} value={oneCategory}>{oneCategory}</option>
                        ))
                    )}

                </select>
                <button onClick={handleClear}> Clear Filters</button>
            </div>
            <div className={cartStatus ? Styles.cartInclude : Styles.cartNoInclude}>
                <div className={cartStatus ? Styles.productsWithOutCart : Styles.containerProducts}>
                    {productsOnPage.map((product) => (
                        <div className={Styles.oneProduct} key={product.id} onClick={() => handleDetailClick(product.id)}>
                            <div className={Styles.imageContainer}>
                                <img className={Styles.Showimg} src={product.details[0]?.image[0]} alt="Product image" />
                            </div>
                            <label>{product.name}</label>
                            <label>$ {product.price}</label>
                        </div>
                    ))}

                </div>
                {cartStatus && (
                    <Cart />
                )}
            </div>
            <Pagination />
        </div>
    )
}