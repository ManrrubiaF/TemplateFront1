import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    id: number | null;
    email: string | null;
    name: string | null;
    lastName: string | null;
    phone: number | null;
    Bookings: Booking[] | null;
    access: string | null;
}

type Booking = {
    id: number;
    userId: number
    details: Detail[];
    status:string;
}

type Detail = {
    productId: number;
    color: string;
    stock: number;
}

type Editing = {
    isEditing: boolean;
}

const initialState: { User: User; Editing: Editing } = {
    User: {
        id: null,
        email: null,
        name: null,
        lastName: null,
        phone: null,
        Bookings: null,
        access: null,
    },
    Editing: {
        isEditing: false,
    }
}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.User = action.payload;
        },
        setIsEditing: (state, action: PayloadAction<boolean>) => {
            state.Editing.isEditing = action.payload  
        },
        resetUser: (state) => {
            state.User = initialState.User;
        },
    }
})

export const { setUser, setIsEditing, resetUser } = userSlice.actions;
export default userSlice.reducer;