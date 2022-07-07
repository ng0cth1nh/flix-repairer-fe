import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiConstants from '../../constants/Api';
import getErrorMessage from '../../utils/getErrorMessage';
import {RequestStatus} from '../../utils/util';

const initialState = {
  requests: {
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
  'request/fetchRequests',
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
  'request/createRequest',
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

export const confirmFixingRequest = createAsyncThunk(
  'request/confirmFixingRequest',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.put(
        ApiConstants.CONFIRM_FIXING_REQUEST_API,
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

export const approveRequest = createAsyncThunk(
  'request/approveRequest',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.post(
        ApiConstants.APPROVE_REQUEST_API,
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
  'request/cancelRequest',
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

export const requestSlice = createSlice({
  name: 'request',
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

    builder.addCase(confirmFixingRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(confirmFixingRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(approveRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(approveRequest.rejected, (state, action) => {
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

export const {setIsLoading} = requestSlice.actions;
export const selectRequests = state => state.request.requests;
export const selectErrorMessage = state => state.request.errorMessage;
export const selectIsLoading = state => state.request.isLoading;
export default requestSlice.reducer;
