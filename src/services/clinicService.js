import api from './api';

/**
 * Tüm aktif klinikleri getiren API isteğini yapar.
 * @returns {Promise<Array>} API'den dönen kliniklerin listesi.
 */
export const getAllClinics = async () => {
    try {
        // api.js'teki interceptor, token'ı bu isteğe otomatik olarak ekleyecektir.
        const response = await api.get('/patient/clinics');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Klinikler getirilirken bir hata oluştu.' };
    }
};

export const getDoctorsByClinic = async (clinicId) => {
    if (!clinicId) {
        throw new Error("Klinik ID'si belirtilmelidir.");
    }
    try {
        const response = await api.get(`/patient/clinics/${clinicId}/doctors`);
        return response.data;
    } catch (error) {
        console.error(`Klinik ID'si ${clinicId} olan doktorlar getirilirken hata:`, error.response?.data || error.message);
        throw error.response?.data || { message: "Doktorlar yüklenemedi. Lütfen daha sonra tekrar deneyin." };
    }
};