import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useCheckToken = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
          return;
        }

        // Token'ı headers'a ekleyerek API isteği yapıyoruz
        const response = await axios.get(
          'http://10.121.242.101:8000/api/user/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Token geçerli, kullanıcı oturumu açık kalabilir
          return;
        }
      } catch (error) {
        // Token geçersiz veya süresi dolmuş
        await AsyncStorage.removeItem('userToken');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      }
    };

    checkToken();
  }, [navigation]);
};

export default useCheckToken;
