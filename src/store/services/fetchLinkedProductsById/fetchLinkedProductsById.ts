import {createAsyncThunk} from '@reduxjs/toolkit';
import {ThunkConfig} from "../../index";
import {LinkedProduct} from "../../../models";
import {checkCategoryExists} from "../../../utils/checkCategoryExists/checkCategoryExists";

export const fetchLinkedProductsById = createAsyncThunk<
  LinkedProduct[],
  { productId: string, productIdCategory?: string },
  ThunkConfig<string>
>(
  'product-page-slice/fetchLinkedProductsById',
  async ({productId, productIdCategory}, thunkAPI) => {
      const {extra, rejectWithValue} = thunkAPI;
      try {
          const categories = await extra.api.getCategories()
          const response = await extra.api.getLinkedProducts(productId)
          if (!response) {
              throw new Error();
          }
          return response?.map(item => {
              const categoryId = item.category?.id
              if (categoryId === productIdCategory) {
                  return {...item, linkType: 'analog'}
              }

              if (!!categories && categoryId && checkCategoryExists(categoryId, categories)) {
                  return {...item, linkType: 'related'}
              }
              return {...item, linkType: undefined}
          })
      } catch (e) {
          return rejectWithValue('error');
      }
  },
);
