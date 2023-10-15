import { useEffect, useState } from "react";
import { useAppSelector } from "../../Redux/Hooks";
import Styles from './Home.module.css'





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
    const dataAbout = useAppSelector<DataInfo>((state) => state.data) ;
    const [currentImage, setCurrentImage] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    
    useEffect(() => {
        if (dataAbout.videos?.length > 0) {
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
                {dataAbout && dataAbout.photos.length > 0 && (
                    <div className={Styles.carousel}>
                        <button className={Styles.prevButton} onClick={prevImage}>{"<<"}</button>
                        <img className={Styles.Showimg} src={dataAbout.photos[currentImage]} alt="image" />
                        <button className={Styles.nextButton} onClick={nextImage}>{">>"}</button>
                    </div>
                )}
                {dataAbout && dataAbout.videos.length > 0 && (
                    <div className={Styles.videoContainer}>
                        <video controls>
                            <source src={dataAbout.videos[currentVideoIndex]} type="video/mp4" />
                            Tu navegador no admite la reproducción de videos.
                        </video>
                    </div>
                )}
                <div className={Styles.AboutContainer}>
                    <p> {dataAbout?.aboutText}</p>
                </div>
            </div>
        </div>
    )

}