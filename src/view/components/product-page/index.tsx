import {FC, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {ProductCard} from "./productCard/productCard";
import styles from './style/productPage.module.css'
import {useAppDispatch} from "../../../store";
import {fetchProductById} from "../../../store/services/fetchProductById/fetchProductById";
import {useSelector} from "react-redux";
import {
    compareListSelector,
    linkedProductsSelector,
    productSelector,
    productSelectorError,
    productSelectorIsLoading
} from "../../../store/selectors/product-page";
import {productPageActions} from "../../../store/slice/product-page-slice";

export const ProductPage: FC = () => {
    const params = useParams<{ productId: string }>()
    const dispatch = useAppDispatch()

    const productItem = useSelector(productSelector)
    const isLoading = useSelector(productSelectorIsLoading)
    const error = useSelector(productSelectorError)

    const compareList = useSelector(compareListSelector)

    const linkedProductList = useSelector(linkedProductsSelector)

    useEffect(() => {
        const id = params?.productId
        if (!!id) {
            dispatch(fetchProductById(id))
        }
        return () => {
            dispatch(productPageActions.clearData())
        }
    }, [dispatch, params?.productId])

    const shouldRenderProducts = !isLoading && !!productItem && !error
    const shouldRenderLoader = isLoading
    const shouldRenderError = !!error

    const shouldLinkedProductList = !! linkedProductList &&  linkedProductList.length > 0 && !!productItem && !isLoading && !error

    const componentLinkedProductList = linkedProductList?.map(item => {
        if (item.linkType === 'analog') {
            return <div key={item.id}>
                Аналог : <button>{item.name}</button>
            </div>
        }

        if (item.linkType === 'related') {
            return <div key={item.id}>Сопуствующий товар : <button>{item.name}</button></div>
        }
        return <div key={item.id}>
            <button>{item.name}</button>
        </div>
    })

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

        {shouldLinkedProductList && <ul>
            {componentLinkedProductList}
        </ul>}

    </main>;
};
