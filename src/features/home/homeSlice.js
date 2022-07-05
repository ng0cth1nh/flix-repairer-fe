import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiConstants from '../../constants/Api';
import getErrorMessage from '../../utils/getErrorMessage';
import {RequestStatus} from '../../utils/util';

const initialState = {
  requests: {
    pending: null,
    approved: null,
    done: null,
    fixing: null,
    paymentWaiting: null,
    cancelled: null,
  },
  errorMessage: null,
  isLoading: false,
};

export const fetchRequests = createAsyncThunk(
  'home/fetchRequests',
  async ({repairerAPI, status}, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(
        ApiConstants.GET_REQUEST_HISTORY_LIST_API,
        {
          params: {status},
        },
      );

      return {requests: response.data.requestHistories, type: status};
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
    builder.addCase(fetchRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      switch (action.payload.type) {
        case RequestStatus.APPROVED:
          state.requests.approved = action.payload.requests;
          break;
        case RequestStatus.CANCELLED:
          state.requests.cancelled = action.payload.requests;
          break;
        case RequestStatus.PENDING:
          state.requests.pending = action.payload.requests;
          break;
        case RequestStatus.DONE:
          state.requests.done = action.payload.requests;
          break;
        case RequestStatus.FIXING:
          state.requests.fixing = action.payload.requests;
          break;
        case RequestStatus.PAYMENT_WAITING:
          state.requests.paymentWaiting = action.payload.requests;
          break;
        default:
          break;
      }
    });
    builder.addCase(fetchRequests.rejected, (state, action) => {
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
export const selectRequests = state => state.request.requests;
export const selectErrorMessage = state => state.request.errorMessage;
export const selectIsLoading = state => state.request.isLoading;
export default homeSlice.reducer;
