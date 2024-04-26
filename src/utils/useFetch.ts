import useSWR, { SWRResponse } from "swr";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { useCallback, useMemo } from "react";

interface FetchPropsOptions {
  data?: any;
  method?: string;
  headers?: Record<string, unknown>;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  shouldCamelize?: boolean;
  authToken?: string;
  disableCache?: boolean;
  fallbackData?: any;
  onSuccess?: (payload: any) => void;
  onError?: (payload: any) => void;
  timeout?: number;
}

export interface FetchProps {
  url: string;
  options?: FetchPropsOptions;
}

interface Props {
  key: string | string[];
  fetchOptions?: FetchPropsOptions;
  swrOptions?: Record<string, unknown>;
  useAuth?: boolean;
  serviceUnavailableOptions?: any;
}

interface FetchResult<T> extends SWRResponse {
  data: T | undefined;
  error: any;
  isLoading: boolean;
}

// this enabled the cache for ever during the life of the app unless we clear it with explicitly which we does on logout
const cacheEnabled = {
  revalidateIfStale: false,
  revalidateOnFocus: false, // when focus shifts to the current window
  revalidateOnReconnect: false, // when there is a network reconnection
  shouldRetryOnError: false,
};

const cacheDisabled = {
  revalidateIfStale: true,
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
};

export const customFetch = async <T = any>({
  url,
  options,
}: FetchProps): Promise<T> => {
  try {
    if (options?.method === "POST") {
      let mergedHeaders = options.headers;
      if (options.authToken && mergedHeaders) {
        mergedHeaders.accessToken = options.authToken;
      }
      const response = await axios.post(url, options.data ?? options.body, {
        headers: mergedHeaders as AxiosRequestHeaders,
      });
      return response as T; // Cast the response data to type T
    }

    const response = await axios({ url, ...(options as AxiosRequestConfig) });
    return response.data as T; // Cast the response data to type T
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

const useFetch = <T = any>({
  key = "",
  fetchOptions,
  swrOptions = {},
}: Props): FetchResult<T> => {
  const {
    method = "GET",
    headers = {},
    body = {},
    shouldCamelize = false,
    params = {},
    disableCache = true,
    fallbackData,
  } = fetchOptions || {};

  const config = useMemo(() => {
    return {
      options: {
        method,
        headers,
        body,
        params,
        shouldCamelize,
        fallbackData,
      } as FetchPropsOptions,
    };
  }, [method, headers, body, params, shouldCamelize, fallbackData]);

  const fetcher = useCallback(
    async (fetcherKey: string) => {
      const url = Array.isArray(fetcherKey) ? fetcherKey[0] : fetcherKey;
      return customFetch<T>({ url, ...config }).then(async (data: any) => {
        if (data.error) {
          console.log("Inside custom fetch, error:", data);
        }
        return data;
      });
    },
    [config]
  );

  const swrCacheOptions = disableCache ? cacheDisabled : cacheEnabled;

  const { data, error, ...rest } = useSWR<T>(key, fetcher, {
    ...swrCacheOptions,
    ...swrOptions,
  });

  return {
    data,
    error,
    ...rest,
  };
};

export default useFetch;
