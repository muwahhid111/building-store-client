import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    chats: [

    ]
}


export const getChats = createAsyncThunk("get/chats", async (_, thunkAPI) => {
try {
    const res = await fetch("http://localhost:4040/chats", {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
    return res.json()
} catch (error) {
    return thunkAPI.rejectWithValue(error);
}
})

export const sendMessage = createAsyncThunk("post/message", async (act, thunkAPI) => {
    try {

        const res = await fetch("http://localhost:4040/chats/send", {
            method: "POST",
            body: JSON.stringify({
                text: act.text,
                clientId: act.clientId
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "authorization": `Bearer ${localStorage.getItem("token")}`
            },
          });
        return res.json()
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
    })


const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {},
    extraReducers: async (build) => {
        build.addCase(getChats.fulfilled, (state, action) => {

            state.chats = action.payload

        }).addCase(sendMessage.fulfilled, (state, action) => {
            state.chats = state.chats.map(item => {
                console.log(action.payload[0]._id, item._id)

                return item._id === action.payload[0]._id ? action.payload[0] : item
            })
            console.log(state.chats)
        })
    }
})

export default chatsSlice.reducer