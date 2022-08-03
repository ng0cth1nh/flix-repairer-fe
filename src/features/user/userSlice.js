import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ApiConstants from '../../constants/Api';
import getErrorMessage from '../../utils/getErrorMessage';

const initialState = {
  user: {
    avatar: null,
    fullName: null,
    email: null,
    phone: null,
    dateOfBirth: null,
    gender: null,
    role: null,
    experienceDescription: null,
    identityCardNumber: null,
    address: null,
    balance: null,
    communeId: null,
    districtId: null,
    cityId: null,
    registerServices: null,
  },
  errorMessage: null,
  isLoading: false,
};

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (repairerAPI, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(ApiConstants.PROFILE_INFO_API);
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchTransactionHistories = createAsyncThunk(
  'user/fetchTransactionHistories',
  async ({repairerAPI, pageNumber, pageSize}, {rejectWithValue}) => {
    try {
      const response = await repairerAPI.get(
        ApiConstants.GET_TRANSACTION_HISTORIES_API,
        {
          params: {pageNumber, pageSize},
        },
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const sendFeedback = createAsyncThunk(
  'user/sendFeedback',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      console.log(body);
      const formData = new FormData();
      formData.append('feedbackType', body.feedbackType);
      formData.append('title', body.title);
      formData.append('description', body.description);
      body.requestCode && formData.append('requestCode', body.requestCode);
      if (body.images) {
        for (let image of body.images) {
          formData.append('images[]', {
            uri: image.path,
            type: image.mime,
            name: image.path.split('\\').pop().split('/').pop(),
          });
        }
      }
      await repairerAPI.post(ApiConstants.POST_FEEDBACK_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({repairerAPI, body}, {rejectWithValue}) => {
    try {
      await repairerAPI.put(
        ApiConstants.PROFILE_INFO_API,
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

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async ({repairerAPI, avatar}, {rejectWithValue}) => {
    try {
      console.log('avatar:' + avatar);
      const formData = new FormData();
      formData.append(
        'avatar',
        avatar
          ? {
              uri: avatar.path,
              type: avatar.mime,
              name: avatar.path.split('\\').pop().split('/').pop(),
            }
          : avatar,
      );
      await repairerAPI.put(ApiConstants.UPDATE_PROFILE_AVATAR_API, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoading(state) {
      state.isLoading = true;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchProfile.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
      state.user = {
        ...action.payload,
        dateOfBirth:
          action.payload.dateOfBirth !== null
            ? action.payload.dateOfBirth.replace(/-/g, '/')
            : null,
      };
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(updateProfile.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(sendFeedback.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(sendFeedback.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(fetchTransactionHistories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(fetchTransactionHistories.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    builder.addCase(updateAvatar.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(updateAvatar.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });
  },
});

export const {setIsLoading} = userSlice.actions;
export const selectUser = state => state.user.user;
export const selectErrorMessage = state => state.user.errorMessage;
export const selectIsLoading = state => state.user.isLoading;
export default userSlice.reducer;
