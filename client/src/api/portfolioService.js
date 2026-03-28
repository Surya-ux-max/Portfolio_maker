import axios from './axiosConfig';

const API_URL = '/api/portfolio';

const getMyPortfolio = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

const upsertPortfolio = async (portfolioData) => {
  const response = await axios.post(API_URL, portfolioData);
  return response.data;
};

const getPublicPortfolio = async (username) => {
  const response = await axios.get(`${API_URL}/public/${username}`);
  return response.data;
};

const portfolioService = {
  getMyPortfolio,
  upsertPortfolio,
  getPublicPortfolio,
};

export default portfolioService;
