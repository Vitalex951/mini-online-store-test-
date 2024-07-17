import {FC, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {ProductCard} from "./productCard/productCard";
import styles from './style/productPage.module.css'
import {useAppDispatch} from "../../../store";
import {fetchProductById} from "../../../store/services/fetchProductById/fetchProductById";
import {useSelector} from "react-redux";
import {
    productSelector,
    productSelectorError,
    productSelectorIsLoading
} from "../../../store/selectors/product-page";

export const ProductPage: FC = () => {
    const params = useParams<{ productId: string }>()
    const dispatch = useAppDispatch()
    const productCard = useSelector(productSelector)
    const isLoading = useSelector(productSelectorIsLoading)
    const error = useSelector(productSelectorError)

    useEffect(() => {
        const id = params?.productId
        if (!!id) {
            dispatch(fetchProductById(id))
        }
    }, [dispatch, params?.productId])


    console.log('productCard', productCard)
    const shouldRenderProducts = !isLoading && !!productCard && !error
    const shouldRenderLoader = isLoading
    const shouldRenderError = !!error

    return <main>
        {shouldRenderProducts && (

          <div className={styles.container}>
              <ProductCard product={productCard} productType={'main'}/>
              <div className={styles.comparisonContainer}>
                  <div className={styles.wrapperComparison}>
                      <div style={{position: 'relative'}}>
                          <ProductCard product={productCard}/>
                          <div className={styles.text}>Сравнение</div>
                      </div>
                      <ProductCard product={productCard}/>
                      <ProductCard product={productCard}/>
                  </div>
              </div>
          </div>
        )}

        {shouldRenderLoader && <div>...Loading</div>}

        {shouldRenderError && <div>{error}</div>}

    </main>;
};
