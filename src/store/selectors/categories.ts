import {RootState} from "../index";

const categoriesSelector = (state: RootState) => state.categories;

export const categoriesItemsSelector = (state: RootState) => categoriesSelector(state).categoriesItems;