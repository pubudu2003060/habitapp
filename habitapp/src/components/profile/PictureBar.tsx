import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native';
import { CameraOptions, launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useColorStore from '../../store/ColorStore';
import Icon from 'react-native-vector-icons/FontAwesome';

const PictureBar = ({ totalHabits = 0, completedHabits = 0,name=''}) => {
  const [profileImage, setProfileImage] = useState<{ uri: string } | null>(null);
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage({ uri: savedImage });
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };

  const saveProfileImage = async (imageUri: any) => {
    try {
      await AsyncStorage.setItem('profileImage', imageUri);
      setProfileImage({ uri: imageUri });
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take pictures',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Camera permission error:', err);
        return false;
      }
    }
    return true;
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: chooseFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Camera permission is required to take photos');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error:', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const source = { uri: response.assets[0].uri };
        saveProfileImage(source.uri);
      }
    });
  };

  const chooseFromGallery = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const source = { uri: response.assets[0].uri };
        saveProfileImage(source.uri);
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.Card }]}>
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.profileTouchable}
          onPress={handleChoosePhoto}
        >
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image source={profileImage} style={[styles.profileImage,{borderColor:primaryColors.Info}]} />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: primaryColors.Accent, borderColor: primaryColors.Primary }]}>
                <Text style={[styles.placeholderText,{color:currentTheme.SecondoryText}]}>Add Photo</Text>
              </View>
            )}
            <View style={[styles.cameraIcon, { backgroundColor: currentTheme.Background,borderColor:primaryColors.Info }]}>
               <Icon name='camera' size={16} color={primaryColors.Primary} />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={[styles.userName, { color: currentTheme.PrimaryText }]}>{name}</Text>
      </View>

      <View style={[styles.statsContainer, { borderTopColor: currentTheme.Border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: primaryColors.Accent }]}>{totalHabits}</Text>
          <Text style={[styles.statLabel, { color: currentTheme.SecondoryText }]}>Total Habits</Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: currentTheme.Border }]} />

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: primaryColors.Primary }]}>{completedHabits}</Text>
          <Text style={[styles.statLabel, { color: currentTheme.SecondoryText }]}>Completed Today</Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileTouchable: {
    padding: 2,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PictureBar;