'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AppSlider = () => {
    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
        >
            <SwiperSlide>
                <div className="slider-item" style={{
                    backgroundImage: 'url(/images/slide1.jpg)',
                    height: '500px',
                    position: 'relative'
                }}>
                    <div className="slider-content">
                        <h3>BOSE PORTABLE SPEAKER</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        <button>Order Now</button>
                    </div>
                </div>
            </SwiperSlide>

            {/* Thêm các slides khác */}
        </Swiper>
    );
};
export default AppSlider;