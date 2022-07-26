import {StyleSheet, View, TextInput} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function SearchForm({
  search,
  setSearch,
  handleOnChangeSearch,
  placeholder = '',
}) {
  return (
    <View style={styles.searchForm}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        onChangeText={handleOnChangeSearch}
        defaultValue={search}
      />
      {search ? (
        <TouchableOpacity
          onPress={() => {
            setSearch('');
          }}>
          <Icon name="remove" size={20} />
        </TouchableOpacity>
      ) : (
        <Icon name="search" size={20} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchForm: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 15,
  },
  searchInput: {
    width: '80%',
    marginLeft: 10,
  },
});
