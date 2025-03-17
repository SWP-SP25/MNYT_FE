'use client'
import React, { useState, useEffect } from 'react';
import styles from './app-slider.module.css';

// Định nghĩa kiểu dữ liệu cho slide
interface SlideItem {
    id: number;
    title: string;
    content: string;
    image: string;
}

// Dữ liệu mẫu cho slider - đặt trực tiếp trong component
const defaultSlides: SlideItem[] = [
    {
        id: 1,
        title: 'TOP 9 SERUM & KEM TRỊ MỤN',
        content: 'Cho bà bầu HIỆU QUẢ NHẤT',
        image: 'https://res.cloudinary.com/duhhxflsl/image/upload/v1741328121/z6383025874967_66b5f79ade62dbd96a5fbb746cec0286_floi7r.jpg',
    },
    {
        id: 2,
        title: 'Slide 2',
        content: 'Nội dung slide 2',
        image: 'https://res.cloudinary.com/duhhxflsl/image/upload/v1741087885/k8pj8etunyklwrtojami.png',
    },
    // Thêm các slide khác nếu cần
];

interface AppSliderProps {
    slides?: SlideItem[];
    autoPlayInterval?: number;
}

const AppSlider: React.FC<AppSliderProps> = ({
    slides = defaultSlides, // Sử dụng dữ liệu mẫu nếu không có dữ liệu được truyền vào
    autoPlayInterval = 5000
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Chuyển đến slide tiếp theo
    const nextSlide = () => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    // Thiết lập tự động chuyển slide
    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);

        // Xóa interval khi component unmount
        return () => clearInterval(interval);
    }, [autoPlayInterval, slides.length]);

    // Nếu không có slides, hiển thị thông báo hoặc trả về null
    if (!slides || slides.length === 0) {
        return <div className={styles.sliderContainer}>Không có dữ liệu slider</div>;
    }

    return (
        <div className={styles.sliderContainer}>
            <div className={styles.slideContent}>
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <h2>{slide.title}</h2>
                        <p>{slide.content}</p>
                    </div>
                ))}
            </div>

            <div className={styles.indicators}>
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AppSlider;