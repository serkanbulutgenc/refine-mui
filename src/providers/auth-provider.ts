import { type AuthProvider, type HttpError } from '@refinedev/core';

//https://bookish-space-fortnight-6pxp5xpr7w255vv-8000.app.github.dev/_allauth/{client}/v1/auth/login

export const authProvider: AuthProvider = {
  check: async () => {
    const authData = localStorage.getItem('auth');

    if (authData) {
      console.log('authData : ', authData);
      return { authenticated: true };
    }

    return { authenticated: false, logout: true, redirectTo: '/login' };
  },

  login: async ({ loginType, password }) => {
    const res = await fetch(
      `https://bookish-space-fortnight-6pxp5xpr7w255vv-8000.app.github.dev/_allauth/app/v1/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginType,
          password,
        }),
      }
    );

    if (res.status !== 200) {
      return {
        success: false,
        error: { statusCode: res.status, message: res.statusText },
      };
    }

    const data = await res.json();

    if (data) {
      localStorage.setItem('auth', JSON.stringify({ ...data }));
      return {
        success: true,
        redirectTo: '/',
        successNotification: {
          message: ' success',
          description: 'Successfully logged in to the app',
        },
      };
    }

    return { success: false, redirectTo: '/login' };
  },


  logout: async () => {
    localStorage.removeItem('auth');

    return {
      success: true,
      redirectTo: '/login',
    };
  },

  onError: async (error: HttpError) => {
    if (error.status === 401) {
      console.log('error: ', JSON.stringify(error.status));

      /*return {
        logout: true,
        redirectTo: '/login',
        error,
      };*/
    }

    return {};
  },

  getIdentity: async () => {
    const {
      meta: { session_token },
    } = JSON.parse(localStorage.getItem('auth') || '');

    const response = await fetch(
      'https://bookish-space-fortnight-6pxp5xpr7w255vv-8000.app.github.dev/_allauth/app/v1/auth/session',
      {
        headers: {
          //Authorization: `Bearer ${session_token}`,
          'X-Session-Token': `${session_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status < 200 || response.status > 299) {
      return null;
    }
    const {
      data: { user },
    } = await response.json();
    return {
      avatar: 'https://picsum.photos/200',
      email: user.email,
      username: user.username,
      name: user.display,
      id: user.id,
    };
  },
};
