import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Category} from "../../models";
import {fetchCategories} from "../services/fetchCategories/fetchCategories";

type CatalogPageState = {
    categoriesItems: Category[] | null
};

const initialState: CatalogPageState = {
    categoriesItems: null
};

export const categoriesSlice = createSlice({
    name: 'categoriesSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
              state.categoriesItems = action.payload;
          })
    },
})

export const {actions: categoriesActions} = categoriesSlice;
export const {reducer: categoriesReducer} = categoriesSlice;