import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartStatus = {
    status: boolean;
}

type Cart = {
    details: Detail[];
}

type Detail = {
    productId: number | undefined;
    color: string | undefined;
    stock: number | undefined;
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
        setStatus: (state, action: PayloadAction<boolean>) =>{
            state.cartStatus.status =  action.payload
        },
        setCart: (state, action: PayloadAction<Detail>) => {
            state.cart.details.push(action.payload);
        },
        removeProductFromCart: (state, action: PayloadAction<number>) => {
            state.cart.details.splice(action.payload, 1)
        },
        resetCart: (state) => {
            state.cart = initialState.cart; 
        },
    }
})

export const {setStatus, setCart, resetCart, removeProductFromCart} = cartSlice.actions;
export default cartSlice.reducer;