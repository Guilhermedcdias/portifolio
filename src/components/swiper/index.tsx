'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import './page.module.scss';

// Tipagem para as props do seu carrossel, se necessário
type SwiperCoverflowProps = {
    slides: React.ReactNode[];
};

const SwiperCoverflow: React.FC<SwiperCoverflowProps> = ({ slides }) => {
    const initialSlideIndex = Math.floor((slides.length - 1) / 2);
    const [slidesPerView, setSlidesPerView] = useState<number>(3);

    // definindo numero de slides por view a partir do tamanho da tela
    const CountslidesPerView = () => {
        const width = window.innerWidth;
        if (width <= 768) {
            return 1;
        } else if (width <= 1024) {
            return 2;
        } else {
            return 3;
        }
    };

    // quando a tela é carregada, define tambem o numero de slides por view
    useEffect(() => {
        const slides = CountslidesPerView();
        setSlidesPerView(slides);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', () => {
            const slides = CountslidesPerView();
            setSlidesPerView(slides);
        });
    }, []);

    return (
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={slidesPerView}
            initialSlide={initialSlideIndex}
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination]}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    {slide}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SwiperCoverflow;
