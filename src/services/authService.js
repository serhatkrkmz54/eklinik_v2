import { apiPublic } from './api';

/**
 * Kullanıcı giriş işlemini T.C. Kimlik No ve şifre ile gerçekleştirir.
 * @param {string} nationalId - Kullanıcının 11 haneli T.C. Kimlik Numarası.
 * @param {string} password - Kullanıcının şifresi.
 * @returns {Promise<object>} API'den dönen yanıt.
 */
export const loginUser = async (nationalId, password) => {
    try {
        const response = await apiPublic.post('/auth/login', {
            nationalId,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login API Hatası Oluştu:", error.config?.url);
        if (error.response) {
            console.error("HTTP Statüsü:", error.response.status);
            console.error("Sunucudan Gelen Cevap:", JSON.stringify(error.response.data, null, 2));
        }else if (error.request) {
            console.error("Ağ Hatası: Sunucudan cevap alınamadı. Lütfen sunucu durumunu ve ağ bağlantınızı kontrol edin.");
            console.error("Hata Mesajı:", error.message);
        }else {
            console.error("İstek Kurulum Hatası:", error.message);
        }
        throw error.response?.data || { message: 'Bilinmeyen bir ağ hatası oluştu.' };
    }
};

export const registerUser = async (formData) => {
    const payload = {
        userRequest: {
            nationalId: formData.tcKimlik,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            email: formData.email,
            phoneNumber: formData.phone,
        },
    };

    try {
        const response = await apiPublic.post('/auth/register', payload);
        return response.data;
    } catch (error) {
        console.error("Register API Hatası Oluştu:", error.config?.url);
        if (error.response) {
            console.error("HTTP Statüsü:", error.response.status);
            console.error("Sunucudan Gelen Cevap:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("Ağ Hatası: Sunucudan cevap alınamadı.");
            console.error("Hata Mesajı:", error.message);
        } else {
            console.error("İstek Kurulum Hatası:", error.message);
        }
        throw error.response?.data || { message: 'Bilinmeyen bir kayıt hatası oluştu.' };
    }
};
