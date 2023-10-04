import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartStatus = {
    status: boolean;
}

type Cart = {
    details: Detail[];
}

type Detail = {
    productId: number;
    color: string;
    stock: number;
}

const initialState: {
    cartStatus: CartStatus;
    cart: Cart;
} = {
    cartStatus: {
        status: false,
    },
    cart: {
        details: [],
    },
}

const cartSlice = createSlice({
    name: 'CartStatus',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<CartStatus>) =>{
            state.cartStatus.status =  action.payload.status
        },
        setCart: (state, action: PayloadAction<Detail>) => {
            state.cart.details.push(action.payload);
        },
        removeProductFromCart: (state, action: PayloadAction<number>) => {
            state.cart.details = state.cart.details.filter(detail => detail.productId !== action.payload);
        },
        resetCart: (state) => {
            state.cart = initialState.cart; 
        },
    }
})

export const {setStatus, setCart, resetCart, removeProductFromCart} = cartSlice.actions;
export default cartSlice.reducer;