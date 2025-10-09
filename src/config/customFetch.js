import Cookies from "js-cookie";

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed() {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}

function addSubscriber(callback) {
  refreshSubscribers.push(callback);
}

async function refreshAccessToken() {
  try {
    isRefreshing = true;

    const response = await fetch("https://localhost:7176/api/Account/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    isRefreshing = false;
    onRefreshed();
    return true;
  } catch (error) {
    console.error("Refresh token failed:", error);
    isRefreshing = false;
    Cookies.remove("AccessToken");
    Cookies.remove("RefreshToken");
    window.location.href = "/login";
    return false;
  }
}

export async function customFetch(url, options = {}, retry = true) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Nếu server trả 401 (token hết hạn)
  if (response.status === 401 && retry) {
    if (!isRefreshing) {
      await refreshAccessToken();
    } else {
      // Nếu đang refresh => đợi refresh xong
      await new Promise((resolve) => addSubscriber(resolve));
    }

    // Sau khi refresh thành công → gọi lại request ban đầu
    return customFetch(url, options, false);
  }

  return response;
}