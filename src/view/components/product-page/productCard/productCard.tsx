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
      <div className={classNames(styles.productWrapper, mods, [])}>
          <div className={classNames(styles.productName, {}, [styles.productNoWrap])}>
              {product.name}
          </div>
          <div className={styles.productNoWrap}>
              Price: {product.price}
          </div>
      </div>
    );
})
