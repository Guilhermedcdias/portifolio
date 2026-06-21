'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';

const imagens = [
    '/images/pf1.png',
    '/images/pf2.png',
    '/images/pf3.png',
    '/images/pf4.png',
    '/images/pf5.png',
    '/images/pf6.png',
    '/images/pf7.png',
    '/images/pf8.png',
    
];

const FadeImageSlider: React.FC = () => {
    return (
        <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            fadeEffect={{ crossFade: true }}
            loop={true}
        >
            {imagens.map((imagem, index) => (
                <SwiperSlide key={index}>
                    <Image src={imagem} alt={`Slide ${index}`} width={1280} height={1440} priority={index === 0} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default FadeImageSlider;
