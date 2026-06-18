const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return { data };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export const apiClient = {
  get: (url) =>
    apiRequest(url, {
      method: "GET",
    }),

  post: (url, body) =>
    apiRequest(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: (url, body) =>
    apiRequest(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (url) =>
    apiRequest(url, {
      method: "DELETE",
    }),
};
