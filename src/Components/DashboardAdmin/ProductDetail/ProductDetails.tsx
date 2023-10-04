import axios from "axios";
import Styles from './ProductDetails.module.css'
import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Product {
    product: {
        id: number,
        name: string,
        price: string,
        description: string,
        active: boolean,
        category: string,
        details: Detail[],
    }
}
interface Detail {
    color: string,
    stock: number,
    image: string[],
}

export default function DashboardProductDetail(props: Product) {
    const navigate = useNavigate()
    const { product } = props;
    const maxCharCount = 300;
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET || '';
    const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
    const token: string | null = sessionStorage.getItem('token');
    const [dataUpdate, setDataUpdate] = useState(product)
    const [selectedColor, setSelectedColor] = useState('')
    const [detailSelected, setDetailSelected] = useState<Detail>()
    const [ showInput, setShowInput ] = useState(false)
    const [ newColor, setNewColor ] = useState('')


    useEffect(() => {
        setDetailSelected(product.details[0])
    }, [])

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target
        if(event.target instanceof HTMLTextAreaElement && value.length <= maxCharCount){
            setDataUpdate({
                ...dataUpdate,
                [name]:[value]
            });
        }else if(event.target instanceof HTMLInputElement){
            setDataUpdate({
                ...dataUpdate,
                [name]:[value]
            });
        }else if(event.target instanceof HTMLSelectElement){
            if(name === 'active' && value === 'true'){
                setDataUpdate({
                    ...dataUpdate,
                    [name]:true
                });
            }else if(name === 'active' && value === 'false'){
                setDataUpdate({
                    ...dataUpdate,
                    [name]:false
                });
            }else{
                setSelectedColor(value);
                getDetailForColor();
            }
        }
    }

    const handleStockChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        const updatedDetail = { ...detailSelected, stock: parseInt(value, 10) } as Detail;
        const detailIndex = product.details.findIndex(
            (detail) => detail.color === detailSelected?.color
        );
        setDetailSelected(updatedDetail)
        dataUpdate.details[detailIndex] = updatedDetail;
        
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`${BACK_URL}/product/update/${dataUpdate.id}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    },
                    dataUpdate
                })
            toast.success(response.data)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const getDetailForColor = () => {
        const currentDetail = dataUpdate.details.find((detail) => detail.color === selectedColor)
        setDetailSelected(currentDetail)
    }

    const handleDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
        event.dataTransfer.setData("index", index.toString());
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>, toIndex: number) => {
        event.preventDefault();
        const fromIndex = parseInt(event.dataTransfer.getData("index"), 10)
        const detailIndex = product.details.findIndex(
            (detail) => detail.color === detailSelected?.color
        );

        const updatedImages = [...detailSelected?.image || []];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        dataUpdate.details[detailIndex].image = updatedImages;
    };

    const upload = async (file: string | Blob) => {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("upload_preset", UPLOAD_PRESET);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            { method: "POST", body: formdata })
        const data = await response.json()
        return data.secure_url
    };

    const handleNewColor = () => {
        const newDetail = { color: newColor, stock: 0, image: []} as Detail;
        dataUpdate.details.push(newDetail)

    }

    const handleBack = () => {
        if(product !== dataUpdate){
            const confirm = window.confirm('Are you sure? All your changes will be discarded')
            if(confirm){
                navigate(-1)
            }
        }else{
            navigate(-1)
        }
    }


    return (
        <div className={Styles.divMayor}>
            <div>
                <div>
                    <label> Name: </label>
                    <input name="name" type="text" value={dataUpdate.name} onChange={handleChange} />
                </div>
                <div>
                    <label> Price: </label>
                    <input name="price" type="number" step="0.01" value={parseFloat(product.price)} onChange={handleChange} />
                </div>
                <div>
                    <label> Status: </label>
                    <select name="active" value={dataUpdate.active ? 'true' : 'false'} onChange={handleChange}>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                </div>
                <div>
                    <label>Color:</label>
                    <select name="color" value={detailSelected?.color} onChange={handleChange}>
                        {dataUpdate.details.map((Colors) => (
                            <option key={Colors.color} value={Colors.color}>{Colors.color}</option>
                        ))}
                    </select>
                    <button className={Styles.addColor} onClick={()=> setShowInput(true)}> Add Color </button>
                    {showInput && (
                        <div className={Styles.addInputandButton}>
                            <input name="newColor" value='Write Color name' onChange={(event)=> setNewColor(event.target.value)}/>
                            <button onClick={handleNewColor}></button>
                        </div>
                    )}

                </div>
                <div>
                    <label> Stock: </label>
                    <input type="number" name="Stock" value={detailSelected?.stock} onChange={handleStockChange} />
                </div>
                <div>
                    <label> Description: </label>
                    <textarea name="description" onChange={handleChange}>{product.description}</textarea>
                </div>
                <div>
                    <label> Images </label>
                    {detailSelected && (
                        detailSelected.image.map((imageUrl, index) => (
                            <div
                                key={index}
                                className={Styles.imageItem}
                                draggable
                                onDragStart={(event) => handleDragStart(event, index)}
                                onDragOver={handleDragOver}
                                onDrop={(event) => handleDrop(event, index)}
                            >
                                <img src={imageUrl} alt={`Image ${index}`} />
                            </div>
                        ))
                    )}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                    upload(file)
                                        .then((image) => {
                                            detailSelected?.image.push(image);
                                        })
                                        .catch((error) => {
                                            console.error(error);

                                        });
                                }
                            }}
                        />
                    </div>
                </div>
                <Toaster />
                <div className={Styles.DivbuttonsFoot}>
                    <button className={Styles.buttonSubmit} onClick={handleSubmit} > Save </button>
                    <button className={Styles.buttonBack} onClick={handleBack} > Back </button>
                </div>
            </div>
        </div>
    )
}