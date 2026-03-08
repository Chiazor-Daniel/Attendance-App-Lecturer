import React, { use } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ name }: any) => {
  const navigation = useNavigation();
  return !name ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: 'https://france3-regions.franceinfo.fr/image/VrXLtAyOe0Hy7i6nGkZaEyl7Cvw/930x620/regions/2023/06/29/649d5dd285b6d_prof7.jpg',
            }}
            style={styles.avatar}
          />
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Good Morning!</Text>
            <Text style={styles.userName}>Mr Silcko</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('Notification')}
            style={styles.notificationButton}
          >
            <Ionicons name="notifications" size={20} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>4</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.syncSection}>
        <Text style={styles.scheduleTitle}>Day's Schedule: 12th June,2025</Text>
        <TouchableOpacity style={styles.syncButton}>
          <Ionicons name="sync-outline" size={16} color="white" />
          <Text style={styles.syncText}>Sync Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View style={styles.header2}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{name}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // alignItems: 'center',

    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 8,
    borderWidth: 1.4,
    borderColor: '#ec4899',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 9,
    color: '#9ca3af',
    marginBottom: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  syncSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginVertical: 4,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  scheduleTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#4167F914',
    padding: 4,
    borderRadius: 6,
    color: '#1f2937',
  },
  syncText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 9,
  },
  headerRight: {
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 6,
    paddingHorizontal: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#E92C7E',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  header2: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingTop: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Header;
