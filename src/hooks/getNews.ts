
import api from 'src/api';


export const getNews = async (filters = {}) => {
  try {
    const response = await api.post(`/api/get-crypto-news/`, filters);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};
