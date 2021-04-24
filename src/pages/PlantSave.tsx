import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';

import waterdrop from '../assets/waterdrop.png';
import { Button } from '../components/Button';
import { PlantsProps, savePlant } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { useNavigation } from '@react-navigation/native';

interface Params {
  plant: PlantsProps;
}

export function PlantSave() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const navigation = useNavigation();
  const router = useRoute();
  const { plant } = router.params as Params;

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime,
      });
      navigation.navigate('Confirmation', {
        title: 'Tudo certo',
        subtitle:
          'Fique tranquilo que sempre vamos lembra você de cuidar de sua plantinha com muito cuidado.',
        buttomTitle: 'Muito Obrigado :D',
        icon: 'hug',
        nextScreen: 'MyPlants',
      });
    } catch {
      Alert.alert('Não foi possivel salvar. 😟');
    }
  }
  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS === 'android') {
      setShowDatePicker((oldState) => !oldState);
    }
    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert('Escolha uma hora no futuro! ⌚');
    }
    if (dateTime) {
      setSelectedDateTime(dateTime);
    }
  }
  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState);
  }

  return (
    <View style={styles.container}>
      <View style={styles.plantInfo}>
        <SvgFromUri uri={plant.photo} height={150} width={150} />
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantAbout}>{plant.about}</Text>
      </View>
      <View style={styles.controller}>
        <View style={styles.tipContainer}>
          <Image style={styles.tipImage} source={waterdrop} />
          <Text style={styles.tipText}>{plant.water_tips}</Text>
        </View>
        <Text style={styles.alertLabel}>
          Escolha o melhor horário para ser regado.
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDateTime}
            mode="time"
            display="spinner"
            onChange={handleChangeTime}
          />
        )}
        {Platform.OS === 'android' && (
          <TouchableOpacity
            onPress={handleOpenDateTimePickerForAndroid}
            style={styles.dateTimePickerButton}
          >
            <Text style={styles.dateTimePickerText}>{`Mudar ${format(
              selectedDateTime,
              'HH:mm',
            )}`}</Text>
          </TouchableOpacity>
        )}
        <Button title="Cadastrar planta" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },
  plantName: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginTop: 15,
  },
  plantAbout: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.heading,
    textAlign: 'center',
    marginTop: 10,
  },
  controller: {
    backgroundColor: colors.white,
    padding: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.blue_light,
    borderRadius: 20,
    transform: [{ translateY: -60 }],
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    textAlign: 'justify',
  },
  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
