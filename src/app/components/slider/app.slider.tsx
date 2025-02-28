'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styles from './app.slider.module.css';
import Image from 'next/image';

const AppSlider = () => {
    const slidesData = [
        {
            image: '/images/ads.jpg',
            title: 'Slide 1',
            content: 'Nội dung slide 1'
        },
        {
            image: '/images/ads2.jpg',
            title: 'Slide 2',
            content: 'Nội dung slide 2'
        }
    ];

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
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                width={800}
                                height={400}
                                className={styles.slideImage}
                            />
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