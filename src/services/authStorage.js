import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'userToken';

/**
 * Verilen JWT'yi AsyncStorage'e kaydeder.
 * @param {string} token - Kaydedilecek JWT.
 */
export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error('Token saklanırken hata oluştu:', error);
    }
};

/**
 * AsyncStorage'den JWT'yi alır.
 * @returns {Promise<string|null>} Kayıtlı token veya null.
 */
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Token alınırken hata oluştu:', error);
        return null;
    }
};

/**
 * AsyncStorage'den token'ı siler.
 */
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Token silinirken hata oluştu:', error);
    }
};

/**
 * Kayıtlı token'ı çözerek içindeki kullanıcı verilerini (payload) döndürür.
 * Token yoksa veya süresi dolmuşsa null döner.
 * @returns {Promise<object|null>} Kullanıcı verileri veya null.
 */
export const getUserFromToken = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return null;
        }

        const decodedToken = jwtDecode(token);
        // Token'ın süresinin dolup dolmadığını kontrol et
        if (decodedToken.exp * 1000 < Date.now()) {
            console.log('Oturum süresi dolmuş, token temizleniyor.');
            await removeToken();
            return null;
        }
        return decodedToken;
    } catch (error) {
        console.error('Token çözümlenirken hata oluştu:', error);
        await removeToken();
        return null;
    }
};
