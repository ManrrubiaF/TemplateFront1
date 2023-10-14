import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type UserMenu = {
    option: string;
    islogged: boolean;
}

const initialState: UserMenu = {
    option: 'Profile',
    islogged: false,
}

const UserMenuSlice = createSlice({
    name: 'UserMenu',
    initialState,
    reducers: {
        setOption: (state, action: PayloadAction<string>)=>{
            state.option = action.payload;
        },
        setIsLogged: (state, action: PayloadAction<boolean>) =>{
            state.islogged = action.payload
        },
        resetUserMenu: (state) => {
            state = initialState;
        }
    }
})

export const { setOption, setIsLogged, resetUserMenu } = UserMenuSlice.actions;
export default UserMenuSlice.reducer;