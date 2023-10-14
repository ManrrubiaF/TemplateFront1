import { configureStore } from "@reduxjs/toolkit";
import  productReducer  from './Slice/productSlice'
import dataReducer from './Slice/contactSlice'
import userReducer from "./Slice/userSlice";
import cartReducer from './Slice/CartSlice'
import paginationReducer from "./Slice/PaginationSlice";
import userMenuReducer from "./Slice/UserMenu";
import filterReducer from './Slice/FilterSlice';


export const store = configureStore({
    reducer:{
        products: productReducer,
        data: dataReducer,
        user: userReducer,
        cart: cartReducer,
        pagination: paginationReducer,
        userMenu: userMenuReducer,
        filter: filterReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;