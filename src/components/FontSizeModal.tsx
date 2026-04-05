// src/components/FontSizeModal.tsx

import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

interface FontSizeModalProps {
  visible: boolean;
  onClose: () => void;
  currentFontSize: number;
  onSave: (fontSize: number) => Promise<void>;
  texts: {
    title?: string;
    preview?: string;
    cancel?: string;
    save?: string;
  };
}

const FontSizeModal = React.memo(({
  visible,
  onClose,
  currentFontSize,
  onSave,
  texts,
}: FontSizeModalProps) => {
  const [previewFontSize, setPreviewFontSize] = useState(currentFontSize);
  const insets = useSafeAreaInsets();

  // Сбрасываем preview при открытии модального окна
  React.useEffect(() => {
    if (visible) {
      setPreviewFontSize(currentFontSize);
    }
  }, [visible, currentFontSize]);

  const handleSliderChange = useCallback((value: number) => {
    setPreviewFontSize(value);
  }, []);

  const handleSave = useCallback(async () => {
    await onSave(previewFontSize);
    onClose();
  }, [previewFontSize, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setPreviewFontSize(currentFontSize);
    onClose();
  }, [currentFontSize, onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent={false}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, scale(20)) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{texts.title ?? 'Font Size'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.previewText, { fontSize: previewFontSize }]}>
              {texts.preview ?? 'Sample text - Preview'}
            </Text>

            <Text style={styles.sizeValue}>{previewFontSize}px</Text>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>12</Text>
              <Slider
                style={styles.slider}
                minimumValue={12}
                maximumValue={24}
                step={2}
                value={previewFontSize}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#00A651"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#00A651"
              />
              <Text style={styles.sliderLabel}>24</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>{texts.cancel ?? 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>{texts.save ?? 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(10),
    flex: 1,
    paddingVertical: verticalScale(14),
  },
  cancelText: {
    color: '#6B7280',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: scale(20),
  },
  content: {
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  footer: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(20),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  previewText: {
    color: '#1F2937',
    lineHeight: 28,
    marginBottom: verticalScale(16),
    minHeight: verticalScale(60),
    textAlign: 'center',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#00A651',
    borderRadius: moderateScale(10),
    flex: 1,
    paddingVertical: verticalScale(14),
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  sizeValue: {
    color: '#00A651',
    fontSize: moderateScale(32),
    fontWeight: '700',
    marginBottom: verticalScale(16),
  },
  slider: {
    flex: 1,
    height: verticalScale(40),
    marginHorizontal: scale(10),
  },
  sliderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(4),
    width: '100%',
  },
  sliderLabel: {
    color: '#6B7280',
    fontSize: moderateScale(14),
    fontWeight: '500',
    minWidth: scale(24),
    textAlign: 'center',
  },
  title: {
    color: '#1F2937',
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
});

export default FontSizeModal;
