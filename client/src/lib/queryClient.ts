import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response, on401: UnauthorizedBehavior = "throw") {
  if (!res.ok) {
    if (res.status === 401 && on401 === "returnNull") {
      return null;
    }
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
  return true;
}

export async function apiRequest<T = any>(
  urlOrOptions: string | {
    url: string; 
    method: string;
    data?: unknown | undefined;
    on401?: UnauthorizedBehavior;
  },
  configOrUndefined?: {
    method: string;
    body?: string;
    on401?: UnauthorizedBehavior;
  }
): Promise<T> {
  let url: string;
  let method: string;
  let body: string | undefined;
  let on401: UnauthorizedBehavior | undefined;
  let headers: Record<string, string> = {};
  
  // Handle both function signatures for backward compatibility
  if (typeof urlOrOptions === 'string') {
    // Old format: apiRequest(url, config)
    url = urlOrOptions;
    if (configOrUndefined) {
      method = configOrUndefined.method;
      body = configOrUndefined.body;
      on401 = configOrUndefined.on401;
      if (body) {
        headers["Content-Type"] = "application/json";
      }
    } else {
      method = 'GET';
    }
  } else {
    // New format: apiRequest({ url, method, data })
    url = urlOrOptions.url;
    method = urlOrOptions.method;
    body = urlOrOptions.data ? JSON.stringify(urlOrOptions.data) : undefined;
    on401 = urlOrOptions.on401;
    if (urlOrOptions.data) {
      headers["Content-Type"] = "application/json";
    }
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body,
    credentials: "include",
  });

  const checkResult = await throwIfResNotOk(res, on401);
  if (checkResult === null) {
    return null as unknown as T;
  }
  
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
