import { createSlice } from '@reduxjs/toolkit';

// Try to hydrate from localStorage synchronously
let initialUser = null;
let initialToken = null;

try {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    initialToken = storedToken;
    initialUser = JSON.parse(storedUser);
  }
} catch {
  // Corrupted data - clear it
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const initialState = {
  user: initialUser,
  token: initialToken,
  loading: false, // Synchronous hydration means we don't need a loading state for initial render
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      state.token = token;
      state.user = user;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateCredits: (state, action) => {
      if (state.user) {
        state.user.credits = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    updatePlan: (state, action) => {
      if (state.user) {
        state.user.plan = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  }
});

export const { login, logout, setLoading, updateCredits, updatePlan } = authSlice.actions;

// Thunk for logout to hit the API, matching previous AuthContext logic
export const logoutUser = () => async (dispatch, getState) => {
  const { auth } = getState();
  const token = auth.token;

  if (token) {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      // server unreachable — still log out locally
    }
  }

  dispatch(logout());
};

export default authSlice.reducer;
