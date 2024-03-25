import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [],
};

export const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            let existed = false;
            for (let idx = 0; idx < state.data.length; idx++) {
                const cartItem = state.data[idx];
                if (cartItem._id === action.payload._id) {
                    const tmp = {
                        ...cartItem,
                        quantity: cartItem.quantity + 1,
                    }
                    state.data[idx] = tmp;
                    existed = true;
                }
            }

            if (!existed) {
                const tmp = {
                    ...action.payload,
                    quantity: 1,
                }
                state.data.push(tmp);
            }
        },

        removeFromCart: (state, action) => {
            for (let idx = 0; idx < state.data.length; idx++) {
                const cartItem = state.data[idx];
                if (cartItem._id === action.payload._id) {
                    const tmp = {
                        ...cartItem,
                        quantity: cartItem.quantity - 1,
                    }

                    if (tmp.quantity === 0) {
                        state.data.splice(idx, 1);
                    } else {
                        state.data[idx] = tmp;
                    }
                }
            }
        },

        deleteFromCart: (state, action) => {
            for (let idx = 0; idx < state.data.length; idx++) {
                const cartItem = state.data[idx];
                if (cartItem._id === action.payload._id) {
                    state.data.splice(idx, 1);
                }
            }
        },

        clearCart: (state) => {
            state.data = [];
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
} = slice.actions;
export const selectCart = (state) => state.cart;
export default slice.reducer;
