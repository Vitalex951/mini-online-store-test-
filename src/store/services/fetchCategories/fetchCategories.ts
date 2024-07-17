import {createAsyncThunk} from '@reduxjs/toolkit';
import {Category} from "../../../models";
import {ThunkConfig} from "../../index";
import {logDOM} from "@testing-library/react";

export const fetchCategories = createAsyncThunk<
    Category[],
    string,
    ThunkConfig<string>
    >(
        'categories-slice/fetchCategories',
        async (productId, thunkAPI) => {
            const { extra, rejectWithValue } = thunkAPI;
            try {
                const response = await extra.api.getCategories()
                console.log('категории', response)
                if (!response) {
                    throw new Error();
                }

                return response;
            } catch (e) {
                return rejectWithValue('Категории не найдены');
            }
        },
    );
