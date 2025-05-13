import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    rating: 5,
    review:
      'The quality of meat is exceptional! I ordered mutton and chicken, both were delivered fresh. Will definitely order again.',
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 4,
    review:
      'Love the homemade pickles, they add a perfect tangy flavor to the meat dishes. Delivery was quick and packaging was excellent.',
  },
  {
    id: 3,
    name: 'Rahul Patel',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    review:
      'Been ordering from FreshCuts for the past 6 months. Consistent quality and service. Their marinated meats are a time-saver!',
  },
  {
    id: 4,
    name: 'Priya Singh',
    avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg',
    rating: 5,
    review:
      'The WhatsApp order updates were very helpful. I could track exactly when my order was out for delivery. Premium service!',
  },
];

const CustomerReviews: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={18}
        fill={index < rating ? 'currentColor' : 'none'}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">What Our Customers Say</h2>
        <p className="text-center text-gray-600 mb-12">
          Read reviews from our satisfied customers
        </p>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex mt-1">{renderStars(review.rating)}</div>
                  </div>
                </div>
                <p className="text-gray-600 flex-grow">{review.review}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CustomerReviews;