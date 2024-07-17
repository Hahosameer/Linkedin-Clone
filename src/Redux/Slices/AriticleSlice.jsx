import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  article: [],
  loading: false,
  error: null,
  progress: 0,
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    getArticlePending: (state) => {
      state.loading = true;
    },
    getArticleSuccess: (state, action) => {
      state.article = action.payload;
      state.loading = false;
    },
    getArticleFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    postArticlePending: (state) => {
      state.loading = true;
    },
    postArticleSuccess: (state, action) => {
      state.article.unshift(action.payload);
      state.loading = false;
      state.progress = 0; // Reset progress after successful post
    },
    postArticleFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const {
  getArticlePending,
  getArticleSuccess,
  getArticleFailure,
  postArticlePending,
  postArticleSuccess,
  postArticleFailure,
  setProgress,
} = articleSlice.actions;

export default articleSlice.reducer;
