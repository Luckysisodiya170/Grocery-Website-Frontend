import apiService from "./api";

export const getOrdersHistory = async (page = 1, limit = 10) => {
  try {
    const response = await apiService.get(`/customers/orders-list?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};


