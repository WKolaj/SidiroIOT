import authHeader from './authHeader.service';

const API_URL = process.env.NODE_ENV === "production" ? '/api/' : "http://localhost:5003/api/";

class UserService {
  getPublicContent() {
    //return axios.get(API_URL + 'all');
  }

  getS4Data() {
    //return axios.get(API_URL + 'users4', { headers: authHeader() });
  }

  getS8Data() {
    //return axios.get(API_URL + 'users8', { headers: authHeader() });
  }

  getAdminBoard() {
    //return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();