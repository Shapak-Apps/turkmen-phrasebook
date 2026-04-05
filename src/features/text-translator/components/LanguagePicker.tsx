// src/features/text-translator/components/LanguagePicker.tsx
// Компонент для выбора языка

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TranslatorLanguage } from '../types/text-translator.types';
import { DesignColors } from '../../../constants/Design';

interface LanguagePickerProps {
  visible: boolean;
  languages: TranslatorLanguage[];
  selectedLanguage: string;
  onSelect: (languageCode: string) => void;
  onClose: () => void;
  title?: string;
}

export default function LanguagePicker({
  visible,
  languages,
  selectedLanguage,
  onSelect,
  onClose,
  title = 'Select Language',
}: LanguagePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем языки по поисковому запросу
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onSelect(code);
    setSearchQuery('');
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: TranslatorLanguage }) => {
    const isSelected = item.code === selectedLanguage;

    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedItem]}
        onPress={() => handleSelect(item.code)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={[styles.languageName, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
          <Text style={[styles.nativeName, isSelected && styles.selectedNative]}>
            {item.nativeName}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={DesignColors.background}
          translucent={false}
        />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search languages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Language List */}
        <FlatList
          data={filteredLanguages}
          renderItem={renderLanguageItem}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No languages found</Text>
              <Text style={styles.emptySubtext}>Try a different search</Text>
            </View>
          }
        />

        {/* Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  container: {
    backgroundColor: DesignColors.background,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  flag: {
    fontSize: 32,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  languageName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  nativeName: {
    color: '#6B7280',
    fontSize: 14,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
  },
  selectedNative: {
    color: '#059669',
  },
  selectedText: {
    color: '#10B981',
  },
  separator: {
    backgroundColor: '#F3F4F6',
    height: 1,
    marginHorizontal: 16,
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
});
