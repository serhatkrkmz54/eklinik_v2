// src/services/doctorService.js

import useSWR from 'swr';
import { fetcher } from './api';
import api from './api';
import { useMemo } from 'react'; // YENİ: useMemo'yu import ediyoruz

// Yardımcı fonksiyon
function formatDateForApi(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
}

// Bu hook'ta değişiklik yok, doğru çalışıyor.
export function useDoctor(doctorId) {
    const { data, error, isLoading } = useSWR(
        doctorId ? `/patient/doctors/${doctorId}` : null,
        fetcher
    );

    return {
        doctor: data,
        isLoading,
        isError: error
    };
}

// DÜZELTİLMİŞ HOOK
export function useDoctorSlots(doctorId) {
    // useMemo kullanarak tarihlerin her render'da yeniden hesaplanmasını engelliyoruz.
    // Boş bağımlılık dizisi `[]` sayesinde bu blok sadece ilk render'da çalışır.
    const { startDate, endDate } = useMemo(() => {
        const start = formatDateForApi(new Date());
        const end = new Date();
        end.setDate(end.getDate() + 30);
        return {
            startDate: start,
            endDate: formatDateForApi(end)
        };
    }, []); // <-- Boş dizi, bunun sadece bir kez çalışmasını sağlar.

    // Artık `key` her render'da aynı kalacak, değişmeyecek.
    const key = doctorId ? [`/patient/doctors/${doctorId}/slots-in-range`, startDate, endDate] : null;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher);

    return {
        slotsData: data,
        isLoadingSlots: isLoading,
        isErrorSlots: error,
        mutateSlots: mutate
    };
}

// Bu fonksiyon aynı kalıyor.
export const bookAppointment = async (scheduleId) => {
    try {
        const response = await api.post(`/patient/appointments/${scheduleId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Randevu oluşturulamadı.' };
    }
};