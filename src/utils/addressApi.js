import apiService from "../utils/api";

export const addAddress = async (addressData) => {
  try {
    const response = await apiService.post("/customers/profile/address", addressData);
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};