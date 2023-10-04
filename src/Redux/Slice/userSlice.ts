import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: number | null;
    email: string | null;
    name: string | null;
    lastName: string | null;
    phone: number | null;
    Bookings: Booking[] | null;
    access:string;
}

type Booking = {
    id: number;
    userId: number
    details: Detail[];
}

type Detail = {
    productId: number;
    color: string;
    stock: number;
}

const initialState: User = {
    id: null,
    email: '',
    name: '',
    lastName: '',
    phone: null,
    Bookings: null,
    access: '',

}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            return action.payload
        },
        resetUser: (state) => {
            state = initialState;
        },
    }
})

export const { setUser , resetUser} = userSlice.actions;
export default userSlice.reducer;