import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LinkedProduct, Product} from "../../models";
import {fetchProductById} from "../services/fetchProductById/fetchProductById";
import {fetchLinkedProductsById} from "../services/fetchLinkedProductsById/fetchLinkedProductsById";

type CatalogPageState = {
    product: Product | undefined;
    linkedProducts: LinkedProduct[] | undefined;
    comparingProducts: Product[] | undefined;
    isLoading: boolean;
    error: string | null;
};

const initialState: CatalogPageState = {
    product: undefined,
    linkedProducts: undefined,
    comparingProducts: undefined,
    isLoading: true,
    error: null,
};

export const productPageSlice = createSlice({
    name: 'productPage',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        // Основной продукт
        setProduct(state, action: PayloadAction<Product>) {
            state.product = action.payload
        },

        //Связанные продукты
        setLinkedProducts(state, action: PayloadAction<LinkedProduct>) {
            state.linkedProducts = state?.linkedProducts ? [...state?.linkedProducts, action.payload] : [action.payload]
        },

        //Сравнение продуктов
        setComparingProducts(state, action: PayloadAction<Product>) {
            // проверяем, есть ли элемент с таким же id, что и добавляемыый продукт
            if(!state?.comparingProducts?.some(el => el.id === action.payload.id)) {
                state.comparingProducts = state?.comparingProducts ? [...state?.comparingProducts, action.payload] : [action.payload]
            }
        },
        deleteComparingProduct(state, action: PayloadAction<string>) {
            state.comparingProducts = state?.comparingProducts?.filter(el => el.id !== action.payload)
        },

        //очистка данных
        clearData(state) {
            state.linkedProducts = undefined
            state.comparingProducts = undefined
            state.product = undefined
            state.error = null
            state.isLoading = true
        }
    },
    extraReducers: (builder) => {
        builder
          // получение продукта по id
          .addCase(fetchProductById.pending, (state) => {
              state.isLoading = true;
              state.error = null;
          })
          .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
              state.isLoading = false;
              state.product = action.payload;
          })
          .addCase(fetchProductById.rejected, (state, action) => {
              state.isLoading = false;
              state.error = action.payload || null;
          })

          // получение аналогов/сопуствующих товаров
          .addCase(fetchLinkedProductsById.fulfilled, (state, action: PayloadAction<LinkedProduct[]>) => {
              state.linkedProducts = action.payload
          });
    },
})

export const {actions: productPageActions} = productPageSlice;
export const {reducer: productPageReducer} = productPageSlice;