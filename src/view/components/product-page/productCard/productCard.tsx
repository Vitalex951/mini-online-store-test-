import {memo} from "react";
import {Product} from "../../../../models";
import styles from './productCard.module.css'
import {classNames, Mods} from "../../../../utils/classNames/classNames";

type ProductType = 'main' | 'secondary';

type ProductCardPropsType = {
    product: Product
    productType?: ProductType
}
export const ProductCard = memo((props: ProductCardPropsType) => {
    const {
        product,
        productType = 'secondary'
    } = props

    const mods: Mods = {
        [styles.mainProductWrapper]: productType === 'main'
    }

    return (
      <div className={styles.container}>
          <div className={classNames(styles.productWrapper, mods, [])}>
              <div className={styles.productName}>
                  {product.name}
              </div>
              <div>
                  Price: {product.price}
              </div>
          </div>
      </div>
    );
})
