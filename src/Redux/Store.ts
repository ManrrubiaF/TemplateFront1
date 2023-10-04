import { configureStore } from "@reduxjs/toolkit";
import  productReducer  from './Slice/productSlice'
import dataReducer from './Slice/contactSlice'
import userReducer from "./Slice/userSlice";
import cartReducer from './Slice/CartSlice'
import paginationReducer from "./Slice/PaginationSlice";


export const store = configureStore({
    reducer:{
        products: productReducer,
        data: dataReducer,
        user: userReducer,
        cart: cartReducer,
        pagination: paginationReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;