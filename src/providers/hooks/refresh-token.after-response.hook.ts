import ky, { type Hooks } from "ky";

type RefreshTokenAfterResponseHookOptions = {
  ACCESS_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;
  REFRESH_TOKEN_URL: string;
};

/**
 * Middleware to handle token refresh on 401 responses.
 *
 * @param {string} refineOptions.ACCESS_TOKEN_KEY - The key used to retrieve the access token from localStorage.
 * @param {string} refineOptions.REFRESH_TOKEN_KEY - The key used to retrieve the refresh token from localStorage.
 * @param {string} refineOptions.REFRESH_TOKEN_URL - The URL to send the refresh token request to.
 * @returns Ky afterResponse hook function.
 * @example
 * ```ts
 * import { refreshTokenAfterResponseHook } from "@refinedev/rest";
 *
 * const dataProvider = createDataProvider("https://api.example.com", {}, {
 *   hooks: {
 *     afterResponse: [refreshTokenAfterResponseHook({
 *       ACCESS_TOKEN_KEY: "access_token",
 *       REFRESH_TOKEN_KEY: "refresh_oken",
 *       REFRESH_TOKEN_URL: "https://api.example.com/refresh-token",
 *     })],
 *   },
 * });
 * ```
 */
export const refreshTokenAfterResponseHook =
  (
    refineOptions: RefreshTokenAfterResponseHookOptions,
  ): NonNullable<Hooks["afterResponse"]>[number] =>
  async (request, _options, response) => {
    if (response.status === 401) {
      const currentRefreshToken = localStorage.getItem(
        refineOptions.REFRESH_TOKEN_KEY,
      );

      try {
        const {
          data: { access_token, refresh_token, session_token },
        } = await ky<{ data: { access_token: string; refresh_token: string } }>(
          refineOptions.REFRESH_TOKEN_URL,
          {
            method: "post",
            body: JSON.stringify({ refresh_token: currentRefreshToken }),
          },
        ).json();

        localStorage.setItem(refineOptions.ACCESS_TOKEN_KEY, access_token);
        localStorage.setItem(refineOptions.REFRESH_TOKEN_KEY, refresh_token);

        request.headers.set("Authorization", `Bearer ${access_token}`);

        return ky(request);
      } catch (e) {
        return response;
      }
    }

    return response;
  };
