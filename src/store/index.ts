import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { productPageReducer } from './reducers/product-page';
import {IProductPageRepository} from "../services/products/interfaces";
import {MockProductPageGateway} from "../gateways/product-page";
import {useDispatch} from "react-redux";

export const rootReducer = combineReducers({
  productPage: productPageReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

const preloadedState: Partial<RootState> = {};

export interface ThunkExtraArg {
  api: IProductPageRepository
}
export interface ThunkConfig<T> {
  rejectValue: T
  state: RootState
  extra: ThunkExtraArg
}

const extraArg: ThunkExtraArg = {
  api: new MockProductPageGateway()
};


export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: extraArg,
    },
  }),
});


// затипизировали наш dispatch
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
