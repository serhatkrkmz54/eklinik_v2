import api from './api';
import Toast from 'react-native-toast-message';

/**
 * Tüm aktif klinikleri getiren API isteğini yapar.
 * Hata durumunda toast bildirimi gösterir ve boş bir dizi döner.
 * @returns {Promise<Array>} API'den dönen kliniklerin listesi veya hata durumunda boş dizi.
 */
export const getAllClinics = async () => {
    try {
        const response = await api.get('/patient/clinics');
        return response.data;
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Klinikler Yüklenemedi',
            text2: error.response?.data?.message || 'Klinikler getirilirken bir sunucu hatası oluştu.'
        });
        return [];
    }
};

/**
 * Belirtilen kliniğe ait doktorları getiren API isteğini yapar.
 * Hata durumunda toast bildirimi gösterir ve boş bir dizi döner.
 * @param {number} clinicId - Doktorları getirilecek kliniğin ID'si.
 * @returns {Promise<Array>} API'den dönen doktorların listesi veya hata durumunda boş dizi.
 */
export const getDoctorsByClinic = async (clinicId) => {
    if (!clinicId) {
        console.error("Klinik ID'si belirtilmelidir.");
        Toast.show({
            type: 'error',
            text1: 'Bir Hata Oluştu',
            text2: 'Klinik seçimi olmadan doktorlar listelenemez.'
        });
        return [];
    }
    try {
        const response = await api.get(`/patient/clinics/${clinicId}/doctors`);
        return response.data;
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Doktorlar Yüklenemedi',
            text2: error.response?.data?.message || "Doktorlar yüklenemedi. Lütfen daha sonra tekrar deneyin."
        });
        return [];
    }
};
