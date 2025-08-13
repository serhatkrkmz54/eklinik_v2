import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
    SafeAreaView, ActivityIndicator, ScrollView, Animated, RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import Toast from 'react-native-toast-message';

import { getMyProfile } from '../services/userService';
import { AuthContext } from '../context/AuthContext';

const LoadingDots = () => {
    const animations = [
        useRef(new Animated.Value(0.3)).current,
        useRef(new Animated.Value(0.3)).current,
        useRef(new Animated.Value(0.3)).current,
    ];

    useEffect(() => {
        const animate = () => {
            const sequence = animations.map((anim, index) => {
                return Animated.sequence([
                    Animated.delay(index * 200),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0.3,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]);
            });

            Animated.loop(Animated.parallel(sequence)).start();
        };

        animate();
    }, []);

    return (
        <View style={styles.loadingDotsContainer}>
            {animations.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.loadingDot,
                        {
                            opacity: anim,
                            transform: [
                                {
                                    scale: anim.interpolate({
                                        inputRange: [0.3, 1],
                                        outputRange: [1, 1.2],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserData = useCallback(async () => {
        try {
            const data = await getMyProfile();
            // DEBUG: API'den gelen ham veriyi logla
            setUserData(data);
        } catch (error)
        {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: error.message || 'Kullanıcı bilgileri alınamadı',
            });
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchUserData().finally(() => setLoading(false));
        }, [fetchUserData])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserData().finally(() => setRefreshing(false));
    }, [fetchUserData]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Belirtilmemiş';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    if (loading || !userData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#008B8B' />
                <Text style={styles.loadingText}>Profil Yükleniyor...</Text>
                <LoadingDots />
            </View>
        );
    }


    const { patientProfile = {} } = userData;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{flexGrow: 1, paddingBottom: 125}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#008B8B']}
                        tintColor={'#008B8B'}
                    />
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditProfile', { userData })}
                    >
                        <MaterialIcons name="edit" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.profileSection}>
                        <View style={[styles.profileImageContainer, patientProfile.hasChronicIllness && styles.chronicIllnessBorder]}>
                            <Image
                                source={require('../../assets/default-user.jpg')}
                                style={styles.profileImage}
                            />
                        </View>
                        <Text style={styles.userName}>{`${userData.firstName || ''} ${userData.lastName || ''}`}</Text>
                        <Text style={styles.roleText}>Hasta</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <MaterialIcons name="badge" size={24} color="#fff" />
                            <Text style={styles.statLabel}>T.C. Kimlik No</Text>
                            <Text style={styles.statValue}>{userData.nationalId || '---'}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <MaterialIcons name="cake" size={24} color="#fff" />
                            <Text style={styles.statLabel}>Doğum Tarihi</Text>
                            <Text style={styles.statValue}>{formatDate(patientProfile.dateOfBirth)}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <MaterialIcons name="height" size={24} color="#fff" />
                            <Text style={styles.statLabel}>Boy/Kilo</Text>
                            <Text style={styles.statValue}>{patientProfile.height ? `${patientProfile.height}cm` : '--'}/{patientProfile.weight ? `${patientProfile.weight}kg` : '--'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
                    {userData.email && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="email" size={24} color="#008B8B" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>E-posta Adresi</Text>
                                <Text style={styles.infoValue}>{userData.email}</Text>
                            </View>
                        </View>
                    )}
                    {userData.phoneNumber && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="phone" size={24} color="#008B8B" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Telefon Numarası</Text>
                                <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
                            </View>
                        </View>
                    )}
                    {patientProfile.address && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="location-pin" size={24} color="#008B8B" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Adres</Text>
                                <Text style={styles.infoValue}>{patientProfile.address}</Text>
                            </View>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>Sağlık Geçmişi</Text>
                    {(patientProfile.birthPlaceCity || patientProfile.birthPlaceDistrict) && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="location-city" size={24} color="#008B8B" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Doğum Yeri</Text>
                                <Text style={styles.infoValue}>
                                    {patientProfile.birthPlaceCity || ''}
                                    {patientProfile.birthPlaceCity && patientProfile.birthPlaceDistrict ? ' / ' : ''}
                                    {patientProfile.birthPlaceDistrict || ''}
                                </Text>
                            </View>
                        </View>
                    )}
                    {patientProfile.country && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="public" size={24} color="#008B8B" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Ülke</Text>
                                <Text style={styles.infoValue}>{patientProfile.country}</Text>
                            </View>
                        </View>
                    )}
                    {patientProfile.hasChronicIllness !== null && typeof patientProfile.hasChronicIllness !== 'undefined' && (
                        <View style={[styles.infoRow, patientProfile.hasChronicIllness && styles.chronicIllnessRow]}>
                            <MaterialIcons name="healing" size={24} color={patientProfile.hasChronicIllness ? '#FF4B55' : '#008B8B'} />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Kronik Hastalık</Text>
                                <Text style={styles.infoValue}>{patientProfile.hasChronicIllness ? 'Var' : 'Yok'}</Text>
                            </View>
                        </View>
                    )}
                    {patientProfile.isMedicationDependent !== null && typeof patientProfile.isMedicationDependent !== 'undefined' && (
                        <View style={styles.infoRow}>
                            <MaterialIcons name="medication" size={24} color="#008B8B" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Sürekli İlaç Kullanımı</Text>
                                <Text style={styles.infoValue}>{patientProfile.isMedicationDependent ? 'Var' : 'Yok'}</Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <MaterialIcons name="logout" size={22} color="#fff" />
                        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: FONTS.inter.medium,
        color: '#666',
    },
    loadingDotsContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#008B8B',
    },
    header: {
        backgroundColor: '#008B8B',
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    editButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 40,
        marginBottom: 20,
    },
    profileImageContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#fff',
        padding: 4,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    chronicIllnessBorder: {
        borderColor: '#FF4B55',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 45,
    },
    userName: {
        fontSize: 22,
        color: '#fff',
        fontFamily: FONTS.poppins.semiBold,
    },
    roleText: {
        fontSize: 14,
        fontFamily: FONTS.inter.medium,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: '70%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'center',
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        marginTop: 5,
        fontFamily: FONTS.poppins.regular,
    },
    statValue: {
        color: '#fff',
        fontSize: 14,
        fontFamily: FONTS.poppins.medium,
    },
    detailsContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONTS.inter.bold,
        color: '#333',
        marginBottom: 15,
        marginTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    chronicIllnessRow: {
        borderColor: '#FF4B55',
    },
    infoTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontFamily: FONTS.inter.regular,
        color: '#999',
    },
    infoValue: {
        fontSize: 16,
        fontFamily: FONTS.inter.medium,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#FF4B55',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.inter.semiBold,
        marginLeft: 10,
    },
});

export default ProfileScreen;
