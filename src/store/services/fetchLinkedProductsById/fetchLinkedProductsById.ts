import {createAsyncThunk} from '@reduxjs/toolkit';
import {ThunkConfig} from "../../index";
import {Product} from "../../../models";

export const fetchLinkedProductsById = createAsyncThunk<
  Product[],
  string,
  ThunkConfig<string>
>(
  'product-page-slice/fetchLinkedProductsById',
  async (productId, thunkAPI) => {
      const {extra, rejectWithValue} = thunkAPI;
      try {
          const response = await extra.api.getLinkedProducts(productId)
          console.log('responseresponse', response)
          if (!response) {
              throw new Error();
          }
          return response;
      } catch (e) {
          return rejectWithValue('error');
      }
  },
);
