import {createAsyncThunk} from '@reduxjs/toolkit';
import {ThunkConfig} from "../../index";
import {Product} from "../../../models";
import {fetchLinkedProductsById} from "../fetchLinkedProductsById/fetchLinkedProductsById";

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  ThunkConfig<string>
>(
  'product-page-slice/fetchProductById',
  async (productId, thunkAPI) => {
      const {extra, rejectWithValue, dispatch} = thunkAPI;
      try {
          const response = await extra.api.getProduct(productId)

          if (!response) {
              throw new Error();
          }

          //дожидаемся получения продукта по id, и, если запрос успешно прошел, запрашиваем другие товары и передаем id категории продукта
          dispatch(fetchLinkedProductsById({productId: productId, productIdCategory: response.category?.id}))

          return response;
      } catch (e) {
          return rejectWithValue('Товар не найден');
      }
  },
);
