import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentRate: number;
  onSave: (rate: number) => void;
  texts?: {
    title?: string;
    test?: string;
    cancel?: string;
    save?: string;
  };
}

export default function SpeechRateModal({ visible, onClose, currentRate, onSave, texts }: Props) {
  const [rate, setRate] = useState(currentRate);
  const insets = useSafeAreaInsets();

  // Reset rate when modal opens
  useEffect(() => {
    if (visible) {
      setRate(currentRate);
    }
  }, [visible, currentRate]);

  const testSpeed = () => {
    Speech.speak('Hello, this is a test of the speech rate.', { rate, language: 'en-US' });
  };

  const handleSave = () => {
    onSave(rate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, scale(20)) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{texts?.title ?? 'Speech Rate'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.rateText}>{rate.toFixed(2)}x</Text>

            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.05}
              value={rate}
              onValueChange={setRate}
              minimumTrackTintColor="#00A651"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#00A651"
            />

            <View style={styles.labels}>
              <Text style={styles.label}>0.5x</Text>
              <Text style={styles.label}>1.0x</Text>
              <Text style={styles.label}>2.0x</Text>
            </View>

            <TouchableOpacity style={styles.testButton} onPress={testSpeed}>
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.testButtonText}>{texts?.test ?? 'Test Speed'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{texts?.cancel ?? 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>{texts?.save ?? 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
    paddingVertical: verticalScale(20),
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
  label: {
    color: '#6B7280',
    fontSize: moderateScale(12),
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(5),
    paddingHorizontal: scale(10),
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  rateText: {
    color: '#00A651',
    fontSize: moderateScale(48),
    fontWeight: '700',
    marginBottom: verticalScale(20),
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
  slider: {
    height: verticalScale(40),
    width: '100%',
  },
  testButton: {
    alignItems: 'center',
    backgroundColor: '#00A651',
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    gap: scale(8),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  title: {
    color: '#1F2937',
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
});
