import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiConstants from '../../constants/Api';
import getErrorMessage from '../../utils/getErrorMessage';
import {numberWithCommas, RequestStatus} from '../../utils/util';

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

export const fetchRequestDetail = createAsyncThunk(
  'request/fetchRequestDetail',
  async ({repairerAPI, requestCode}, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(
        ApiConstants.GET_REQUEST_DETAIL_API,
        {
          params: {requestCode},
        },
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const rateCustomer = createAsyncThunk(
  'request/rateCustomer',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.post(
        ApiConstants.CREATE_COMMENT_API,
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

export const updateRequest = createAsyncThunk(
  'request/updateRequest',
  async (
    {repairerAPI, requestCode, subServiceIds, accessoryIds, extraServices},
    {rejectWithValue},
  ) => {
    try {
      await repairerAPI.put(
        ApiConstants.PUT_FIXED_SUB_SERVICE_OF_REQUEST_API,
        JSON.stringify({requestCode, subServiceIds}),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      await repairerAPI.put(
        ApiConstants.PUT_FIXED_ACCESSORY_OF_REQUEST_API,
        JSON.stringify({requestCode, accessoryIds}),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      await repairerAPI.put(
        ApiConstants.PUT_FIXED_EXTRA_SERVICE_OF_REQUEST_API,
        JSON.stringify({requestCode, extraServices}),
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
      if (
        err.response.data.message &&
        err.response.data.message.startsWith(
          'BALANCE_MUST_GREATER_THAN_OR_EQUAL_',
        )
      ) {
        let number = +err.response.data.message.replace(
          'BALANCE_MUST_GREATER_THAN_OR_EQUAL_',
          '',
        );
        return rejectWithValue(
          `Số dư phải lớn hơn hoặc bằng ${numberWithCommas(
            number,
          )} vnđ\nVui lòng nạp thêm tiền vào tài khoản`,
        );
      }
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

export const createInvoice = createAsyncThunk(
  'request/createInvoice',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.post(
        ApiConstants.POST_INVOICE_API,
        JSON.stringify(body),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      if (
        err.response.data.message &&
        err.response.data.message.startsWith(
          'BALANCE_MUST_GREATER_THAN_OR_EQUAL_',
        )
      ) {
        let number = +err.response.data.message.replace(
          'BALANCE_MUST_GREATER_THAN_OR_EQUAL_',
          '',
        );
        return rejectWithValue(
          `Số dư phải lớn hơn hoặc bằng ${numberWithCommas(
            number,
          )} vnđ\nVui lòng nạp thêm tiền vào tài khoản`,
        );
      }
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const confirmPayment = createAsyncThunk(
  'request/confirmPayment',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.put(
        ApiConstants.CONFIRM_PAYMENT_API,
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

export const fetchFixedService = createAsyncThunk(
  'request/fetchFixedService',
  async ({repairerAPI, requestCode}, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(
        ApiConstants.GET_FIXED_SERVICE_OF_REQUEST_API,
        {
          params: {requestCode},
        },
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchInvoice = createAsyncThunk(
  'request/fetchInvoice',
  async ({repairerAPI, requestCode}, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(ApiConstants.GET_INVOICE_API, {
        params: {requestCode},
      });
      return response.data;
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
    resetState: () => initialState,
  },
  extraReducers: builder => {
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

    builder.addCase(updateRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(updateRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(fetchRequestDetail.fulfilled, (state, action) => {
      state.errorMessage = null;
    });
    builder.addCase(fetchRequestDetail.rejected, (state, action) => {
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

    builder.addCase(fetchInvoice.fulfilled, (state, action) => {
      state.errorMessage = null;
    });
    builder.addCase(fetchInvoice.rejected, (state, action) => {
      state.errorMessage = action.payload;
    });

    builder.addCase(fetchFixedService.fulfilled, (state, action) => {
      state.errorMessage = null;
    });
    builder.addCase(fetchFixedService.rejected, (state, action) => {
      state.errorMessage = action.payload;
    });

    builder.addCase(createInvoice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(createInvoice.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(confirmPayment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(confirmPayment.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(rateCustomer.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(rateCustomer.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

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

export const {setIsLoading, resetState} = requestSlice.actions;
export const selectRequests = state => state.request.requests;
export const selectErrorMessage = state => state.request.errorMessage;
export const selectIsLoading = state => state.request.isLoading;
export default requestSlice.reducer;
