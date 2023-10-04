import axios from "axios";
import Styles from './Products.module.css'
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import DashboardProductDetail from "../ProductDetail/ProductDetails";

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
    const [productData, setProductData] = useState<Product[]>()
    const BACK_URL = process.env.REACT_APP_BACK_URL
    const [selectedProduct, setSelectedProduct] = useState<Product>();

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/booking/update`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setProductData(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getProducts()
    }, [])



    return (
        <div className={Styles.divMayor}>
            {!selectedProduct && (
                <div className={Styles.titleContainer}>
                    <label> Photo</label>
                    <label> Name</label>
                    <label> Price</label>
                    <label>Category</label>
                    <label> Active</label>
                </div>
            )}
            {selectedProduct ? (
                <DashboardProductDetail product={selectedProduct} />
            ) : (
                productData && (productData?.map((oneProduct) => (
                    <div className={Styles.dataProduct} key={oneProduct.id}>
                        <div onClick={() => setSelectedProduct(oneProduct)}>
                            <img src={oneProduct.details[0].image[0]} alt="product image" />
                        </div>
                        <div>
                            <p>{oneProduct.name}</p>
                        </div>
                        <div>
                            <p>{oneProduct.category}</p>
                        </div>
                        <div >
                            <p>{oneProduct.price}</p>
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
            )}
            <Toaster />
        </div>
    )

}
