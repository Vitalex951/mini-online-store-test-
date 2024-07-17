import {FC, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {ProductCard} from "./productCard/productCard";
import styles from './style/productPage.module.css'
import {useAppDispatch} from "../../../store";
import {fetchProductById} from "../../../store/services/fetchProductById/fetchProductById";
import {useSelector} from "react-redux";
import {
    compareListSelector,
    productSelector,
    productSelectorError,
    productSelectorIsLoading
} from "../../../store/selectors/product-page";

export const ProductPage: FC = () => {
    const params = useParams<{ productId: string }>()
    const dispatch = useAppDispatch()

    const productItem = useSelector(productSelector)
    const isLoading = useSelector(productSelectorIsLoading)
    const error = useSelector(productSelectorError)

    const compareList = useSelector(compareListSelector)


    useEffect(() => {
        const id = params?.productId
        if (!!id) {
            dispatch(fetchProductById(id))
        }
    }, [dispatch, params?.productId])


    const shouldRenderProducts = !isLoading && !!productItem && !error
    const shouldRenderLoader = isLoading
    const shouldRenderError = !!error

    const shouldCompareList = !!compareList && compareList.length > 0 && !!productItem && !isLoading && !error

    return <main>
        {shouldRenderProducts && (

          <div className={styles.container}>
              <ProductCard product={productItem} productType={'main'}/>
              <div className={styles.comparisonContainer}>
                  <div className={styles.wrapperComparison}>
                      <div style={{position: 'relative'}}>
                          <ProductCard product={productItem}/>
                          <div className={styles.text}>Сравнение</div>
                      </div>
                      <ProductCard product={productItem}/>
                      <ProductCard product={productItem}/>
                  </div>
              </div>
          </div>
        )}

        {shouldRenderLoader && <div>...Loading</div>}

        {shouldRenderError && <div>{error}</div>}

        {shouldCompareList && <ul>
            {compareList.map(item => {
                if (item.category?.id === productItem?.category?.id) {
                    return <div>
                        Аналог : {item.name}
                    </div>
                }

                if (item.category?.id?.[0] === productItem?.category?.id?.[0]) {
                    return <div>Сопуствующий товар : {item.name} </div>
                }
                return <div>{item.name} </div>
            })}
        </ul>}

    </main>;
};
