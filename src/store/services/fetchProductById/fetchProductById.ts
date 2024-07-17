import { createAsyncThunk } from '@reduxjs/toolkit';
import {ThunkConfig} from "../../index";
import {Product} from "../../../models";

export const fetchProductById = createAsyncThunk<
    Product,
    string,
    ThunkConfig<string>
    >(
        'product-page-slice/fetchProductById',
        async (productId, thunkAPI) => {
            const { extra, rejectWithValue } = thunkAPI;
            try {
                const response = await extra.api.getProduct(productId)

                if (!response) {
                    throw new Error();
                }

                return response;
            } catch (e) {
                return rejectWithValue('error');
            }
        },
    );
