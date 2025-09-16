<template>
  <v-app theme="light">
    <EditorLayout>
      <router-view />
    </EditorLayout>
  </v-app>
</template>

<script setup>
import EditorLayout from './components/EditorLayout.vue';
</script>