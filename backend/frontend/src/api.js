import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Initial mock data state for graceful offline demonstration
const mockComplaints = [
  {
    id: 101,
    title: 'Major Pothole on Station Road',
    description: 'Deep pothole causing severe traffic congestion and damage near Ward 12 bus stop.',
    category: { id: 1, name: 'Roads & Infrastructure' },
    status: 'IN_PROGRESS',
    createdAt: '2026-09-27T10:15:00',
    updatedAt: '2026-09-28T09:30:00',
    ward: { id: 12, wardNumber: 'WARD-12' },
    citizen: { id: 1, firstName: 'KASAK', lastName: 'SINGH', email: 'citizen@sevasetu.gov.in' },
    assignedWorker: { id: 201, firstName: 'RAMESH', lastName: 'KUMAR' },
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 102,
    title: 'Overflowing Garbage Bin near Market Area',
    description: 'Commercial waste has not been collected for 3 days. Creates unbearable smell and health hazard.',
    category: { id: 2, name: 'Sanitation & Waste' },
    status: 'SUBMITTED',
    createdAt: '2026-09-28T08:00:00',
    updatedAt: '2026-09-28T08:00:00',
    ward: { id: 12, wardNumber: 'WARD-12' },
    citizen: { id: 1, firstName: 'KASAK', lastName: 'SINGH', email: 'citizen@sevasetu.gov.in' },
    assignedWorker: null,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 103,
    title: 'Broken Streetlight outside Govt High School',
    description: 'Dark area at night making it unsafe for students and pedestrians after dusk.',
    category: { id: 3, name: 'Electrical & Lighting' },
    status: 'RESOLVED',
    createdAt: '2026-09-24T14:20:00',
    updatedAt: '2026-09-26T17:45:00',
    ward: { id: 5, wardNumber: 'WARD-05' },
    citizen: { id: 2, firstName: 'PRIYA', lastName: 'SHARMA', email: 'priya@gmail.com' },
    assignedWorker: { id: 202, firstName: 'SURESH', lastName: 'PATEL' },
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80'
  }
];

let localComplaints = [...mockComplaints];

// API Service Interface with Live Backend + Fallback Support
export const AuthService = {
  async register(userData) {
    try {
      const res = await api.post('/users/register', userData);
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, using simulated response:', err.message);
      return `SUCCESS: User registered successfully! Please check your email for the OTP. (Dev Mode)`;
    }
  },

  async login(credentials) {
    try {
      const res = await api.post('/users/login', credentials);
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, using simulated login:', err.message);
      return `Login successful! Welcome back, ${credentials.email.split('@')[0].toUpperCase()}`;
    }
  },

  async verifyOtp({ email, otp }) {
    try {
      const res = await api.post('/users/verify-otp', { email, otp });
      return res.data;
    } catch (err) {
      return { success: true, message: 'Account verified successfully!' };
    }
  }
};

export const ComplaintServiceApi = {
  async getComplaintsByWard(wardId) {
    try {
      const res = await api.get(`/complaints/ward/${wardId}`);
      return res.data;
    } catch (err) {
      return localComplaints.filter(c => c.ward?.id === Number(wardId) || String(c.ward?.wardNumber).includes(String(wardId)));
    }
  },

  async getComplaintsByCitizen(citizenId) {
    try {
      const res = await api.get(`/complaints/citizen/${citizenId}`);
      return res.data;
    } catch (err) {
      return localComplaints;
    }
  },

  async getAllComplaints() {
    try {
      const res = await api.get('/complaints');
      return res.data;
    } catch (err) {
      return localComplaints;
    }
  },

  async createComplaint(formData, citizenId) {
    try {
      // If formData is FormData instance (with file)
      if (formData instanceof FormData) {
        const res = await api.post(`/complaints?citizenId=${citizenId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
      } else {
        const res = await api.post(`/complaints?citizenId=${citizenId}`, formData);
        return res.data;
      }
    } catch (err) {
      const newComplaint = {
        id: Date.now(),
        title: formData.get ? formData.get('title') : formData.title,
        description: formData.get ? formData.get('description') : formData.description,
        category: { id: 1, name: 'General Municipal Request' },
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ward: { id: 12, wardNumber: 'WARD-12' },
        citizen: { id: citizenId, firstName: 'Citizen User' },
        assignedWorker: null,
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop&q=80'
      };
      localComplaints.unshift(newComplaint);
      return newComplaint;
    }
  },

  async updateStatus(id, status) {
    try {
      const res = await api.patch(`/complaints/${id}/status?status=${status}`);
      return res.data;
    } catch (err) {
      const item = localComplaints.find(c => c.id === id);
      if (item) item.status = status;
      return item;
    }
  },

  async assignWorker(id, workerId) {
    try {
      const res = await api.patch(`/complaints/${id}/assign?workerId=${workerId}`);
      return res.data;
    } catch (err) {
      const item = localComplaints.find(c => c.id === id);
      if (item) {
        item.status = 'ASSIGNED';
        item.assignedWorker = { id: workerId, firstName: 'Municipal Staff #' + workerId };
      }
      return item;
    }
  }
};

export default api;
