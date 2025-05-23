import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const carouselItems = [
  {
    id: 1,
    image: '/images/hero-bvrm1.jpg',
    title: 'Our farms located at Bhimavaram',
    description: 'Fresh meat from the City of destiny.',
    buttonLink: '/products',
    buttonText: 'Shop Now',
  },
{
  id: 2,
    image: 'https://images.pexels.com/photos/1025804/pexels-photo-1025804.jpeg',
    title: 'Premium Quality Raw Meat',
    description: 'Ethically sourced and expertly butchered for the finest quality.',
    buttonLink: '/products',
    buttonText: 'Shop Now',
  },

  {
    id: 3,
    image: '/images/hero-pickels.jpeg',
    title: 'Homemade Pickles',
    description: 'Traditional recipes with a modern twist. The perfect pairing.',
    buttonLink: '/pickles',
    buttonText: 'Explore',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/1639559/pexels-photo-1639559.jpeg',
    title: 'Fast & Fresh Delivery',
    description: 'We deliver within hours to ensure maximum freshness.',
    buttonLink: '/terms',
    buttonText: 'Learn More',
  },
];

const HeroCarousel: React.FC = () => {
  return (
    <div className="relative pt-[72px]">
      <Swiper
        modules={[ Pagination, Autoplay]}
        //navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-[70vh] md:h-[90vh]"
      >
        {carouselItems.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-8">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-2xl">
                  {item.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-xl">
                  {item.description}
                </p>
                <Link
                  to={item.buttonLink}
                  className="px-8 py-3 bg-sea-500 hover:bg-sea-600 text-white rounded-md transition transform hover:scale-105 font-semibold"
                >
                  {item.buttonText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    

    </div>
  );
};

export default HeroCarousel;