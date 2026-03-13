import api from '../utils/api';

export const interviewService = {
  getInterviewHistory: async (page = 1, limit = 10, filters = {}) => {
    const { category, search, sortBy } = filters;
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);

    const response = await api.get(`/interview/history?${params.toString()}`);
    return response.data;
  },

  deleteInterview: async (interviewId) => {
    const response = await api.delete(`/interview/${interviewId}`);
    return response.data;
  },

  getInterviewDetails: async (interviewId) => {
    const response = await api.get(`/interview/${interviewId}`);
    return response.data;
  }
};