import {FC, useCallback, useEffect, useState} from 'react';
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
import {LinkedProduct, Product} from "../../../models";
import {Modal} from "../common/modal";

export const ProductPage: FC = () => {
    const params = useParams<{ productId: string }>()
    const [activeProductModal, setActiveProductModal] = useState<LinkedProduct | null>(null)

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

    useEffect(()=> {
        const closeModalPressButtonBack = () => {
            setActiveProductModal(null)
        }
        if(!!activeProductModal) {
            window.history.pushState(null, document.title, window.location.href);
            window.addEventListener('popstate', closeModalPressButtonBack); 
        }

        return () => {
            window.removeEventListener('popstate', closeModalPressButtonBack)
        }
       
    }, [activeProductModal])

    useEffect(() => {
        if (!!productItem) {
            console.log(`Пользователь посмотрел ${productItem?.name}`)
        }
        return () => {
            if (!!productItem) {
                console.log(`Пользователь ушел со страницы ${productItem?.name}`)
            }
        }
    }, [productItem])


    useEffect(() => {
        const id = params?.productId
        if (!!id) {
            dispatch(fetchProductById(id))
        }
        return () => {
            // при размонтировании компоненты, мы подчищаем наши данные со стейта
            dispatch(clearData())
        }
    }, [clearData, dispatch, params?.productId])

    const onSetComparingProduct = (product: Product) => {
        dispatch(setComparingProducts(product))
        console.log(`Пользователь добавил товар для сравнения ${product?.name}`)
    }

    const onRemoveComparingProduct = useCallback((id: string) => {
        dispatch(deleteComparingProduct(id))
    }, [deleteComparingProduct, dispatch]);

    const onShowModalProduct = (product: LinkedProduct) => {
        setActiveProductModal(product)
        console.log(`Пользователь посмотрел аналог товара ${product?.name}`)
    }

    const onCloseModalProduct = () => {
        setActiveProductModal(null)
    }

    const componentLinkedProductList = linkedProductList?.map(item => {
        if (item.linkType === 'analog') {
            return <li key={item.id}>
                Аналог : <button onClick={() => onSetComparingProduct(item)}>{item.name}</button>
            </li>
        }

        if (item.linkType === 'related') {
            return <li key={item.id}>Сопуствующий товар : <button
              onClick={() => onShowModalProduct(item)}>{item.name}</button></li>
        }
        return <li key={item.id}>
            <button onClick={() => onShowModalProduct(item)}>{item.name}</button>
        </li>
    })

    const shouldRenderProducts = !isLoading && !!productItem && !error
    const shouldRenderLoader = isLoading
    const shouldRenderError = !!error

    const shouldRenderLinkedProductList = !!linkedProductList && linkedProductList.length > 0 && !!productItem && !isLoading && !error

    const shouldRenderCompareList = !!compareList && compareList.length > 0

    return <div>
        {shouldRenderProducts && (

          <div className={styles.container}>
              <ProductCard product={productItem} productType={'main'}/>
              <div className={styles.comparisonContainer}>
                  {shouldRenderCompareList && <div className={styles.wrapperComparison}>
                      {compareList.map((item, index) => index === 0
                        ? <div key={item.id} className={styles.relative}>
                            <ProductCard onClick={onRemoveComparingProduct} product={item}/>
                            <div className={styles.text}>Сравнение</div>
                        </div>
                        : <ProductCard
                          key={item.id}
                          onClick={onRemoveComparingProduct}
                          product={item}
                        />)}
                  </div>}
              </div>
          </div>
        )}



        {shouldRenderLoader && <div>...Loading</div>}

        {shouldRenderError && <div>{error}</div>}

        {shouldRenderLinkedProductList && <ul>
            {componentLinkedProductList}
        </ul>}

        {activeProductModal && <Modal onClose={onCloseModalProduct}>
          <ProductCard product={{...activeProductModal}}/>
        </Modal>}

    </div>;
};
