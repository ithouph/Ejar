import React from 'react';
import { Placeholder } from '../components/Placeholder';
import { ThemedView } from '../components/ThemedView';

export default function Ayuda() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Placeholder text="Ayuda (Help)" />
    </ThemedView>
  );
}
