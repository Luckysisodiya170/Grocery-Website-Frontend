export const encodeId = (id) => {
  const secret = "sz"; 
  return btoa(`${secret}-${id}`).replace(/=/g, ""); 
};

export const decodeId = (encoded) => {
  try {
    const decoded = atob(encoded);
    return decoded.split("-")[1]; 
  } catch (e) {
    return null ("Invalid ID", e);
  }
};