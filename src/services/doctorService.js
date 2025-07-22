import api from "./api";

export const getDoctorById = async (doctorId) => {
    try {
        const response = await api.get(`/patient/doctors/${doctorId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Doktor bilgileri alınamadı.' };
    }
};

export const getSlotsByDoctorAndDate = async (doctorId, date) => {
    try {
        const response = await api.get(`/patient/doctors/${doctorId}/slots?date=${date}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Müsait saatler alınamadı.' };
    }
};

export const bookAppointment = async (scheduleId) => {
    try {
        const response = await api.post(`/patient/appointments/${scheduleId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Randevu oluşturulamadı.' };
    }
};