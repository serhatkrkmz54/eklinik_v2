import api from "./api";

export const getMyProfile = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Profil bilgileri alınamadı.' };
    }
};

export const updateMyProfile = async (profileData) => {
    try {
        const response = await api.put('/auth/update-profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Profil güncellenemedi.' };
    }
};
