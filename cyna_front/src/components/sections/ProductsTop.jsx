import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsTop.module.css';
import { fetchProducts } from '../../api/products';
import { fetchServices } from '../../api/services';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { formatPrice, calculateDiscountedPrice } from '../../utils/priceUtils';

const ProductsTop = () => {
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchServices()])
      .then(([products, services]) => {
        // Filtrer produits/services avec promoCode
        const prodsWithPromo = products.filter(p => p.promoCode);
        const servsWithPromo = services.filter(s => s.promoCode);

        const allWithPromo = [
          ...prodsWithPromo.map(p => ({ ...p, type: 'product' })),
          ...servsWithPromo.map(s => ({ ...s, type: 'service' }))
        ];
        setTopItems(allWithPromo);
      })
      .catch(err => console.error('Erreur chargement produits/services:', err));
  }, []);

  return (
    <section className={styles.topSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Les tops promos du moment</h2>
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
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={topItems.length > 1}
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className={styles.swiper}
        >
          {topItems.map((item) => (
            <SwiperSlide key={item.type + '-' + item.id}>
              <Link
                to={item.type === 'product' ? `/product/${item.id}` : `/service/${item.id}`}
                className={styles.productLink}
              >
                <div className={`${styles.productCard} ${item.type === 'product' ? styles['productCard--product'] : styles['productCard--service']}`}>
                  <div className={styles.productImage}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className={styles.productImageTag} />
                    ) : (
                      <div className={styles.servicePlaceholder}>
                        <span className={styles.typeLabel}>
                          {item.type === 'product' ? 'Produit' : 'Service'}
                        </span>
                      </div>
                    )}
                    <span className={styles.typeTag}>
                      {item.type === 'product' ? 'Produit' : 'Service'}
                    </span>
                    <span className={`${styles.label} ${styles.labelPromo}`}>
                      {item.promoCode.discountType === 'percentage'
                        ? `-${item.promoCode.discountValue}%`
                        : `-${item.promoCode.discountValue}€`}
                    </span>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{item.name}</h3>
                    <p className={styles.productDesc}>{item.description}</p>
                    <div className={styles.priceContainer}>
                      <span className={styles.originalPrice}>
                        {formatPrice(item.price)}
                      </span>
                      <span className={styles.promoPrice}>
                        {formatPrice(calculateDiscountedPrice(item.price, item.promoCode))}
                      </span>
                    </div>
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

export default ProductsTop;
