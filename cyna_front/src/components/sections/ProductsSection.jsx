import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsSection.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import carrouselElements from '../dashboard/DashboardCarrousselElements';

// Carousel de produits
const ProductsSection = () => {
  const products = carrouselElements;

  return (
    <section className={styles.productsSection}>
      <div className={styles.banner}>
        <h2 className={styles.bannerTitle}>
          Découvrez <span className={styles.highlight}>nos solutions 360 de cybersécurité </span>pour les PME
        </h2>
        <h4 className={styles.subtitle}>Cyna s’adapte à vos besoins et vous propose un accompagnement dans la protection globale de votre SI.</h4>
      </div>

      <div className={styles.carouselContainer}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className={styles.swiper}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className={styles.productLink}
              >
                <div className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <p className={styles.productCharacteristic}>{product.characteristic}</p>
                    <p className={styles.productPrice}>{product.price}</p>
                    <p className={styles.productAvailability}>{product.availability}</p>
                    <button className={styles.addToCartButton}>
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev-custom"></div>
        <div className="swiper-button-next-custom"></div>
      </div>
    </section>
  );
};

export default ProductsSection;
