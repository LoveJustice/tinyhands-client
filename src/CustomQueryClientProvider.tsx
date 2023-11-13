// import { GetTokenSilentlyOptions, useAuth0 } from '@auth0/auth0-react';
// import axios from 'axios';
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { BASE_REST_URL } from '../../api/constants';
// import { NavigateFunction, useNavigate } from 'react-router-dom';
// import { Cookies } from 'react-cookie';

// axios.defaults.baseURL = BASE_REST_URL;

// const MINUTES_UNTIL_PHOTO_COOKIE_EXPIRES = 5;

type CustomQueryClientProviderProps = {
  children?: ReactNode;
};

function CustomQueryClientProvider(props: CustomQueryClientProviderProps) {
  // const navigate = useNavigate();
  const queryClientConfig = {
    defaultOptions: {
      queries: {
        // This leads to retrying 404s and other things
        // This allows it to be disabled until I enable it on individual queries
        retry: false,
        // Disable refreshing data on window switching.
        // Helpful while developing with one monitor
        refetchOnWindowFocus: false,
      },
    },
  };

  // Must use useState because otherwise every new QueryClient() will reset cache
  const [queryClient] = useState(new QueryClient(queryClientConfig));
  // const queryClient = createMockQueryClientWithAllEndpoints();

  // const { getAccessTokenSilently } = useAuth0();
  // This is to make sure we pass the auth token on every request
  // setupAuth0AxiosInterceptor(navigate, getAccessTokenSilently);

  return (
    // TODO console says something about strict mode. Not fixing it yet, but will try this later:
    // https://stackoverflow.com/a/65918908

    <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
  );
}

// Called before every request based on https://stackoverflow.com/a/43052288/13815107
// Auth0 stuff from https://auth0.com/docs/quickstart/spa/react/02-calling-an-api
// Async because of https://stackoverflow.com/questions/44985708/axios-request-interceptor-wait-until-ajax-call-finishes
// function setupAuth0AxiosInterceptor(
//   navigate: NavigateFunction,
//   getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>,
// ) {
//   axios.interceptors.request.use(
//     async (config) => {
//       // return config;
//       try {
//         // Cached in localstorage, see Auth0Provider component in index.tsx
//         const accessToken = await getAccessTokenSilently({
//           authorizationParams: {
//             audience: process.env.REACT_APP_AUTH0_AUDIENCE_ID!,
//           },
//         });
//         if (!accessToken) {
//           throw Error('No access token from Auth0');
//         }
//
//         const authHeader = `Bearer ${accessToken}`;
//
//         // This cookie will be set for all subsequent requests, not just this one
//         // This is intended, as this code is NOT called for photos anyway (direct image url instead of an axios call)
//         // However, that means you must have used childlight in the last 10 minutes for it to work
//         const cookies = new Cookies();
//         const expires = new Date();
//         expires.setTime(expires.getTime() + 1000 * 60 * MINUTES_UNTIL_PHOTO_COOKIE_EXPIRES);
//         cookies.set('access_token_for_photos', accessToken, { path: '/', expires: expires });
//
//         if (config && config.headers) {
//           config.headers.Authorization = authHeader;
//         } else {
//           config.headers = {
//             Authorization: authHeader,
//           };
//         }
//
//         return config;
//       } catch (e: any) {
//         if (e.message === 'Login required') {
//           console.log('config', config);
//           const notLoggedInDetails =
//             'Tried to make a request before user is logged. url: ' +
//             config.url +
//             ' \n' +
//             ' This is the config ' +
//             JSON.stringify(config);
//           console.log(notLoggedInDetails);
//           navigate('/welcome');
//         } else {
//           e.message = 'Something went wrong with Auth0 token: ' + e.message;
//           throw e;
//         }
//       }
//     },
//     (error) => {
//       // Do something with request error
//       return Promise.reject(error);
//     },
//   );
// }

export default CustomQueryClientProvider;
