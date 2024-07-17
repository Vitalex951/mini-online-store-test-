import {FC, useCallback, useEffect} from 'react';
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
import {Product} from "../../../models";

export const ProductPage: FC = () => {
    const params = useParams<{ productId: string }>()
    const dispatch = useAppDispatch()

    const productItem = useSelector(productSelector)
    const isLoading = useSelector(productSelectorIsLoading)
    const error = useSelector(productSelectorError)

    const compareList = useSelector(compareListSelector)

    const linkedProductList = useSelector(linkedProductsSelector)

    const {
        deleteComparingProduct,
        setComparingProducts,
        clearData
    } = productPageActions

    useEffect(() => {
        const id = params?.productId
        if (!!id) {
            dispatch(fetchProductById(id))
        }
        return () => {
            dispatch(clearData())
        }
    }, [clearData, dispatch, params?.productId])

    const onSetComparingProduct =(product: Product) => {
        dispatch(setComparingProducts(product))
    }

    const onRemoveComparingProduct = useCallback((id: string) => {
        dispatch(deleteComparingProduct(id))
    }, [deleteComparingProduct, dispatch]);

    const shouldRenderProducts = !isLoading && !!productItem && !error
    const shouldRenderLoader = isLoading
    const shouldRenderError = !!error

    const shouldRenderLinkedProductList = !!linkedProductList && linkedProductList.length > 0 && !!productItem && !isLoading && !error

    const shouldRenderCompareList = !!compareList && compareList.length > 0

    const componentLinkedProductList = linkedProductList?.map(item => {
        if (item.linkType === 'analog') {
            return <div key={item.id}>
                Аналог : <button onClick={() => onSetComparingProduct(item)}>{item.name}</button>
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
                  {shouldRenderCompareList && <div className={styles.wrapperComparison}>
                      {compareList.map((item, index) => index === 0
                        ? <div className={styles.relative}>
                            <ProductCard onClick={onRemoveComparingProduct} product={item}/>
                            <div className={styles.text}>Сравнение</div>
                        </div>
                        : <ProductCard  onClick={onRemoveComparingProduct} product={item}/>)}
                  </div>}
              </div>
          </div>
        )}

        {shouldRenderLoader && <div>...Loading</div>}

        {shouldRenderError && <div>{error}</div>}

        {shouldRenderLinkedProductList && <ul>
            {componentLinkedProductList}
        </ul>}

    </main>;
};
