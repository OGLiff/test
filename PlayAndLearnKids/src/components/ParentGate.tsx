// Parent Gate - simple math question to verify parent access

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS, SHADOWS } from '../utils/theme';

interface ParentGateProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

function generateMathQuestion(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 20) + 10;
  const b = Math.floor(Math.random() * 20) + 10;
  const ops = ['+', '-', '*'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];

  let answer: number;
  switch (op) {
    case '+':
      answer = a + b;
      break;
    case '-':
      answer = a - b;
      break;
    case '*':
      answer = a * b;
      break;
  }

  return {
    question: `${a} ${op === '*' ? '×' : op} ${b} = ?`,
    answer,
  };
}

export default function ParentGate({ visible, onSuccess, onCancel }: ParentGateProps) {
  const [mathQ, setMathQ] = useState(generateMathQuestion);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(() => {
    const parsed = parseInt(input, 10);
    if (parsed === mathQ.answer) {
      setInput('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setInput('');
      setMathQ(generateMathQuestion());
    }
  }, [input, mathQ.answer, onSuccess]);

  const handleCancel = useCallback(() => {
    setInput('');
    setError(false);
    setMathQ(generateMathQuestion());
    onCancel();
  }, [onCancel]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Parent Verification</Text>
          <Text style={styles.subtitle}>
            Please solve this math problem to continue:
          </Text>
          <Text style={styles.question}>{mathQ.question}</Text>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            keyboardType="numeric"
            placeholder="Enter answer"
            placeholderTextColor={COLORS.disabled}
            autoFocus
            onSubmitEditing={handleSubmit}
          />
          {error && (
            <Text style={styles.errorText}>
              Incorrect. Try a new question!
            </Text>
          )}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '85%',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  title: {
    ...FONTS.heading,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  question: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  input: {
    width: '60%',
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    fontSize: 24,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  button: {
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    ...FONTS.button,
    color: COLORS.textLight,
  },
  submitText: {
    ...FONTS.button,
    color: COLORS.textOnPrimary,
  },
});
