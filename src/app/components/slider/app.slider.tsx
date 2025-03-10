'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styles from './app.slider.module.css';
import Image from 'next/image';
import { useState } from 'react';

const AppSlider = () => {
    const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

    const slidesData = [
        {
            image: 'https://res.cloudinary.com/duhhxflsl/image/upload/v1741071642/Sample_tets_1_2_kxqgow.jpg',
            title: 'Slide 1',
            content: 'Nội dung slide 1'
        },
        {
            image: 'https://res.cloudinary.com/duhhxflsl/image/upload/v1741071641/Sample_tets_1_1_j93hmg.jpg',
            title: 'Slide 2',
            content: 'Nội dung slide 2'
        }
    ];

    const handleImageError = (imageUrl: string) => {
        setImageError(prev => ({ ...prev, [imageUrl]: true }));
    };

    return (
        <div className={styles.sliderContainer}>
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                className={styles.mySwiper}
            >
                {slidesData.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className={styles.slide}>
                            {!imageError[slide.image] ? (
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    width={800}
                                    height={400}
                                    className={styles.slideImage}
                                    onError={() => handleImageError(slide.image)}
                                    priority={index === 0}
                                />
                            ) : (
                                <div className={styles.errorImage}>
                                    <p>Image not available</p>
                                </div>
                            )}
                            <h3>{slide.title}</h3>
                            <p>{slide.content}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default AppSlider;