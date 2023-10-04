import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../Redux/Hooks";
import axios from "axios";
import { setData } from "../../Redux/Slice/contactSlice";
import Styles from './Home.module.css'



const BACK_URL = process.env.REACT_APP_BACK_URL;

interface DataInfo {
    id: number;
    aboutText: string;
    phone: number;
    whatsapp: number;
    email: string;
    videos: string[];
    photos: string[];
    socialLinks: string[];
}

export default function Home() {
    const dataAbout: DataInfo = useAppSelector((state) => state.data);
    const dispatch = useAppDispatch()
    const [currentImage, setCurrentImage] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/data`)
            dispatch(setData(response.data))

        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        if (dataAbout.videos.length > 0) {
            const randomIndex = Math.floor(Math.random() * dataAbout.videos.length);
            setCurrentVideoIndex(randomIndex);
        }
    }, [dataAbout]);

    const nextImage = () => {
        setCurrentImage((prevImage) => (prevImage + 1) % dataAbout.photos.length);
    };

    const prevImage = () => {
        setCurrentImage((prevImage) => (prevImage - 1 + dataAbout.photos.length) % dataAbout.photos.length);
    };

    return (
        <div className={Styles.divMayor}>
            <div className={Styles.divContainer}>
                {dataAbout.photos.length > 0 && (
                    <div className={Styles.carousel}>
                        <button onClick={prevImage}>Back</button>
                        <div className={Styles.carouselItem}>
                            <img src={dataAbout.photos[currentImage]} alt="image" />
                        </div>
                        <button onClick={nextImage}>Next</button>
                    </div>
                )}
                {dataAbout.videos.length > 0 && (
                    <div className={Styles.videoContainer}>
                        <video controls>
                            <source src={dataAbout.videos[currentVideoIndex]} type="video/mp4" />
                            Tu navegador no admite la reproducción de videos.
                        </video>
                    </div>
                ) }
                <div className={Styles.AboutContainer}>
                    <p> {dataAbout.aboutText}</p>
                </div>
            </div>
        </div>
    )

}