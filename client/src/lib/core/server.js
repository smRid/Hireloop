const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_API_URL");
  }

  return baseUrl.replace(/\/$/, "");
};

const withLeadingSlash = (path) => (path.startsWith("/") ? path : `/${path}`);

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

export const apiRequest = async (path, options = {}) => {
  try {
    const response = await fetch(`${getApiBaseUrl()}${withLeadingSlash(path)}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      return {
        error: data?.message ?? data?.error ?? "Something went wrong",
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (error) {
    return {
      error: error.message ?? "Something went wrong",
    };
  }
};

export const serverFetch = (path, options = {}) => {
  return apiRequest(path, {
    ...options,
    method: "GET",
  });
};

export const serverMutation = (
  path,
  body,
  method = "POST",
  options = {},
) => {
  return apiRequest(path, {
    ...options,
    method,
    body: JSON.stringify(body),
  });
};
