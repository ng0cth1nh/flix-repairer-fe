import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiConstants from '../../constants/Api';
import getErrorMessage from '../../utils/getErrorMessage';

const initialState = {
  requests: {
    suggested: null,
    interested: null,
    filtered: null,
  },
  errorMessage: null,
  isLoading: false,
};

export const fetchSuggestRequests = createAsyncThunk(
  'home/fetchSuggestRequests',
  async ({repairerAPI, type}, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(
        ApiConstants.GET_SUGGEST_REQUEST_API,
        {
          params: {type},
        },
      );
      console.log('GET_' + type + '_REQUEST_API: ' + response.data.requestList);
      return {requests: response.data.requestList, type};
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchFilteredRequests = createAsyncThunk(
  'home/fetchFilteredRequests',
  async ({repairerAPI, param}, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(
        ApiConstants.GET_FILTERED_REQUEST_API,
        {
          params: param,
        },
      );
      console.log('GET_FILTERED_REQUEST_API: ' + response.data.requestList);
      return response.data.requestList;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const createRequest = createAsyncThunk(
  'home/createRequest',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.post(
        ApiConstants.POST_REQUEST_API,
        JSON.stringify(body),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const cancelRequest = createAsyncThunk(
  'home/cancelRequest',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.post(
        ApiConstants.CANCEL_REQUEST_API,
        JSON.stringify(body),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setIsLoading(state) {
      state.isLoading = true;
    },
  },
  extraReducers: builder => {
    // builder.addCase(fetchRequests.pending, state => {
    //   state.isLoading = true;
    // });
    builder.addCase(fetchSuggestRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      switch (action.payload.type) {
        case 'SUGGESTED':
          state.requests.suggested = action.payload.requests;
          break;
        case 'INTERESTED':
          state.requests.interested = action.payload.requests;
          break;
        default:
          break;
      }
    });
    builder.addCase(fetchSuggestRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(fetchFilteredRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.requests.filtered = action.payload;
    });
    builder.addCase(fetchFilteredRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    // builder.addCase(createRequest.pending, state => {
    //   state.isLoading = true;
    // });
    builder.addCase(createRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(createRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    // builder.addCase(cancelRequest.pending, state => {
    //   state.isLoading = true;
    // });
    builder.addCase(cancelRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(cancelRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });
  },
});

export const {setIsLoading} = homeSlice.actions;
export const selectRequests = state => state.home.requests;
export const selectErrorMessage = state => state.home.errorMessage;
export const selectIsLoading = state => state.home.isLoading;
export default homeSlice.reducer;
