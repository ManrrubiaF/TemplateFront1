import axios from "axios";
import Styles from './ProductsDashboard.module.css'
import { useEffect, useState, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "../../Pagination/Pagination";
import { useAppSelector, useAppDispatch } from "../../../Redux/Hooks";
import { setCategory, setOrder, resetState } from "../../../Redux/Slice/FilterSlice";
import { setProducts } from "../../../Redux/Slice/productSlice";
import { useNavigate } from "react-router-dom";
import { setCurrentPage } from "../../../Redux/Slice/PaginationSlice";

interface Product {
    id: number,
    name: string,
    price: string,
    description: string,
    active: boolean,
    category: string,
    details: Detail[],
}
interface Detail {
    color: string,
    stock: number,
    image: string[],
}

export default function ProductsDashBoard() {
    const token: string | null = sessionStorage.getItem('token');
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const productData = useAppSelector((state) => state.products)
    const BACK_URL = process.env.REACT_APP_BACK_URL
    const { elementsPerPage, currentPage } = useAppSelector((state) => state.pagination)
    const filter = useAppSelector((state) => state.filter)
    const [allProduct, setAllProduct] = useState<Product[]>([])
    const categories = [...new Set(allProduct.map(product => product.category))]

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/product/`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            dispatch(setProducts(response.data));
            setAllProduct(response.data);
        } catch (error: any) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        handleFilters();
    }, [filter.category, filter.order])

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

    const sortByAscendingPrice = (products: Product[]) => {
        return products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    };

    const sortByDescendingPrice = (products: Product[]) => {
        return products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    };

    const handleClear = () => {
        dispatch(resetState());
        if (allProduct?.length > 0) {
            dispatch(setProducts(allProduct))
            dispatch(setCurrentPage(1))
        }
    }

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        dispatch(setCategory(value))

    }
    const handleOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        dispatch(setOrder(value));

    }

    const startIndex = (currentPage - 1) * elementsPerPage;
    const endIndex = currentPage * elementsPerPage;
    const productsOnPage = productData.slice(startIndex, endIndex);



    return (
        <div className={Styles.divMayor}>
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
            
                <div className={Styles.titleContainer}>
                    <label> Photo</label>
                    <label> Name</label>
                    <label> Price </label>
                    <label>Category</label>
                    <label> Active</label>
                </div>
            
            {
                productsOnPage && (productsOnPage.map((oneProduct) => (
                    <div className={Styles.dataProduct} key={oneProduct.id}>
                        <div onClick={() => navigate(`/someplace/detail/${oneProduct.id}`)} className={Styles.divImg}>
                            <img src={oneProduct.details[0].image[0]} alt="product image" />
                        </div>
                        <div>
                            <p>{oneProduct.name}</p>
                        </div>
                        <div>
                            <p>{oneProduct.price}</p>
                        </div>
                        <div >
                            <p>{oneProduct.category}</p>
                        </div>
                        <div>
                            {oneProduct.active ? (
                                <p> Enable </p>
                            ) : (
                                <p> Disabled </p>
                            )}
                        </div>
                    </div>
                )))
            }
            <Toaster />
            <Pagination />
        </div>
    )

}
