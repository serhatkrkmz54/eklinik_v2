import api from './api';

/**
 * Kullanıcı giriş işlemini T.C. Kimlik No ve şifre ile gerçekleştirir.
 * @param {string} nationalId - Kullanıcının 11 haneli T.C. Kimlik Numarası.
 * @param {string} password - Kullanıcının şifresi.
 * @returns {Promise<object>} API'den dönen yanıt.
 */
export const loginUser = async (nationalId, password) => {
    try {
        const response = await api.post('/auth/login', {
            nationalId,
            password,
        });
        return response.data;
    } catch (error) {
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
        const response = await api.post('/auth/register', payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Bilinmeyen bir kayıt hatası oluştu.' };
    }
};
