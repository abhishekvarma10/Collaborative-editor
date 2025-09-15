<template>
  <v-app>
    <v-app-bar app dense dark>
      <v-icon class="mr-2">mdi-file-document-edit</v-icon>
      <v-toolbar-title>Collaborative Editor</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip color="green" small>
        <v-icon left small>mdi-circle</v-icon>
        Connected
      </v-chip>
    </v-app-bar>

    <v-main style="background-color: #f3f3f3;">
      <v-container fluid>
        <slot></slot> </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// No script logic needed for this simple layout
</script>