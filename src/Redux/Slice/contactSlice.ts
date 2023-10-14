import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Data = {
    id: number;
    aboutText: string;
    phone: number;
    whatsapp: number;
    email: string;
    photos: string[];
    videos: string[];
    socialLinks: string[];
};


const initialState: Data = {
    id: 0,
    aboutText: '',
    phone: 0,
    whatsapp: 0,
    email: '',
    photos: [],
    videos: [],
    socialLinks: [],
}

const dataSlice = createSlice({
    name: 'Data',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Data>) => {
            return action.payload
        }
    }
});

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;