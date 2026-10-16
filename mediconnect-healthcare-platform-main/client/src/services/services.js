import api from './api'

export const appointmentService = {
  book: (data)             => api.post('/appointments', data),
  getMy: (params)          => api.get('/appointments/my', { params }),
  getById: (id)            => api.get(`/appointments/${id}`),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  getSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}/${date}`),
}

export const doctorService = {
  getAll: (params)        => api.get('/doctors', { params }),
  getById: (id)           => api.get(`/doctors/${id}`),
  getSpecializations: ()  => api.get('/doctors/specializations'),
  getMyProfile: ()        => api.get('/doctors/profile/me'),
  updateProfile: (data)   => api.put('/doctors/profile/me', data),
  updateAvailability: (data) => api.put('/doctors/availability', data),
}

export const consultationService = {
  create: (data)              => api.post('/consultations', data),
  getByAppointment: (apptId)  => api.get(`/consultations/appointment/${apptId}`),
  getMy: ()                   => api.get('/consultations/my'),
  getByPatient: (patientId)   => api.get(`/consultations/patient/${patientId}`),
}

export const prescriptionService = {
  create: (data)              => api.post('/prescriptions', data),
  getMy: ()                   => api.get('/prescriptions/my'),
  getById: (id)               => api.get(`/prescriptions/${id}`),
  getByConsultation: (cId)    => api.get(`/prescriptions/consultation/${cId}`),
}

export const reportService = {
  upload: (formData)          => api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: ()                   => api.get('/reports/my'),
  getByPatient: (patientId)   => api.get(`/reports/patient/${patientId}`),
  delete: (id)                => api.delete(`/reports/${id}`),
}

export const notificationService = {
  getAll: ()      => api.get('/notifications'),
  markRead: (id)  => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
}

export const chatbotService = {
  send: (message) => api.post('/chatbot/message', { message }),
}

export const adminService = {
  getStats: ()              => api.get('/admin/stats'),
  getUsers: (params)        => api.get('/admin/users', { params }),
  getDoctors: (params)      => api.get('/admin/doctors', { params }),
  verifyDoctor: (id, data)  => api.put(`/admin/doctors/${id}/verify`, data),
  toggleActive: (id, data)  => api.put(`/admin/users/${id}/toggle-active`, data),
  getAppointments: (params) => api.get('/admin/appointments', { params }),
}
