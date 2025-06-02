import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useLocation, Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsSection.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { fetchProducts } from '../../api/products';
import { fetchCarousel } from '../../api/carousel';
import { fetchServices } from '../../api/services';
import { calculateDiscountedPrice, formatPrice } from '../../utils/priceUtils';

const ProductsSection = () => {
  const [slides, setSlides] = useState([]);
  const { addToCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const loadSlides = () => {
      Promise.all([fetchCarousel(), fetchProducts(), fetchServices()])
        .then(([carouselConfig, products, services]) => {
          const merged = carouselConfig
            .map(c => {
              const prod = products.find(p => p.id === c.product_id);
              if (prod) return { ...prod, order: c.order, type: 'product' };

              const serv = services.find(s => s.id === c.service_id);
              if (serv) return { ...serv, order: c.order, type: 'service' };

              return null;
            })
            .filter(Boolean)
            .sort((a, b) => a.order - b.order);
          setSlides(merged);
        })
        .catch(err => console.error('Erreur chargement carousel :', err));
    };

    loadSlides();
    window.addEventListener('focus', loadSlides);
    return () => window.removeEventListener('focus', loadSlides);
  }, [location.pathname]);

  return (
    <section className={styles.productsSection}>
      <div className={styles.banner}>
        <h2 className={styles.bannerTitle}>
          Découvrez <span className={styles.highlight}>nos solutions 360 de cybersécurité</span> pour les PME
        </h2>
        <h4 className={styles.subtitle}>
          Cyna s'adapte à vos besoins et vous propose un accompagnement dans la protection globale de votre SI.
        </h4>
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
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className={styles.swiper}
        >
          {slides.map(item => (
            <SwiperSlide key={item.id}>
              <Link to={item.type === 'product' ? `/product/${item.id}` : `/service/${item.id}`} className={styles.productLink}>
                <div className={`${styles.productCard} ${item.type === 'product' ? styles['productCard--product'] : styles['productCard--service']}`}>
                  <div className={styles.productImage}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className={styles.servicePlaceholder}>
                        <span>{item.type === 'product' ? 'Produit' : 'Service'}</span>
                      </div>
                    )}
                    {item.promoCode && (
                      <span className={styles.saleTag}>
                        {item.promoCode.discountType === 'percentage' 
                          ? `-${item.promoCode.discountValue}%` 
                          : `-${item.promoCode.discountValue}€`}
                      </span>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{item.name}</h3>
                    {item.type === 'product' ? (
                      <>
                        <p className={styles.productDescription}>{item.description}</p>
                        <div className={styles.priceContainer}>
                          {item.promoCode ? (
                            <>
                              <span className={styles.originalPrice}>{formatPrice(item.price)}</span>
                              <span className={styles.productPrice}>
                                {formatPrice(calculateDiscountedPrice(item.price, item.promoCode))}
                              </span>
                            </>
                          ) : (
                            <span className={styles.productPrice}>{formatPrice(item.price)}</span>
                          )}
                        </div>
                        <button
                          className={styles.addToCartButton}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(item, 1);
                          }}
                        >
                          Ajouter au panier
                        </button>
                      </>
                    ) : (
                      <>
                        <p className={styles.serviceDescription}>
                          {item.description}
                        </p>
                        <div className={styles.priceContainer}>
                          {item.promoCode ? (
                            <>
                              <span className={styles.originalPrice}>{formatPrice(item.price)}</span>
                              <span className={styles.servicePrice}>
                                {formatPrice(calculateDiscountedPrice(item.price, item.promoCode))}
                              </span>
                            </>
                          ) : (
                            <span className={styles.servicePrice}>{formatPrice(item.price)}</span>
                          )}
                        </div>
                        <button
                          className={styles.addToCartButton}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(item, 1);
                          }}
                        >
                          Ajouter au panier
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev-custom" />
        <div className="swiper-button-next-custom" />
      </div>
    </section>
  );
};

export default ProductsSection;