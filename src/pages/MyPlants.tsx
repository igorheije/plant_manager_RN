import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

import { PlantCardSecundary } from '../components/PlantCardSecundary';
import { PlantsProps, loadPlant, removePlant } from '../libs/storage';
import { Header } from '../components/Header';
import { Load } from '../components/Load';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt },
      );

      setNextWaterd(
        `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} `,
      );
      setMyPlants(plantsStoraged);
      setLoading(false);
    }
    loadStorageData();
  }, []);

  function handleRemove(plant: PlantsProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      { text: 'Não 🙏', style: 'cancel' },
      {
        text: 'Sim 😢',
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants((oldValue) =>
              oldValue.filter((item) => item.id !== plant.id),
            );
          } catch (err) {
            Alert.alert('Não foi possivel remover');
          }
        },
      },
    ]);
  }

  if (loading) return <Load />;
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spotligth}>
        <Image source={waterdrop} style={styles.spotligthImage} />
        <Text style={styles.spotligthText}>{nextWaterd}</Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>
        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecundary
              data={item}
              handleRemove={() => {
                handleRemove(item);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotligth: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotligthImage: {
    width: 60,
    height: 60,
  },
  spotligthText: {
    flex: 1,
    fontSize: 16,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
