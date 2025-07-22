import api from "./api";

export const getMyHistory = async () => {
    try {
        const response = await api.get('/patient/appointments/my-history');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Randevu geçmişi alınamadı.' };
    }
};

/**
 * Belirtilen ID'ye sahip randevuyu iptal eder.
 * @param {number} appointmentId - İptal edilecek randevunun ID'si.
 * @returns {Promise<void>}
 */
export const cancelAppointment = async (appointmentId) => {
    try {
        await api.put(`/patient/appointments/${appointmentId}/cancel`);
    } catch (error) {
        throw error.response?.data || { message: 'Randevu iptal edilemedi.' };
    }
};