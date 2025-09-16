<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-4">
      <v-col>
        <h1 class="text-h4">My Documents</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="createNewDocument">
          <v-icon left>mdi-plus</v-icon>
          New Document
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-list lines="one">
        <v-list-item v-if="documents.length === 0">
          <v-list-item-title>No documents found. Create one to get started!</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="doc in documents"
          :key="doc._id"
          :to="`/documents/${doc._id}`"
          link
        >
          <template v-slot:prepend>
            <v-icon>mdi-file-document-outline</v-icon>
          </template>
          <v-list-item-title>Document ID: {{ doc._id }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { v4 as uuidV4 } from 'uuid';

const documents = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/documents');
    documents.value = response.data;
  } catch (error) {
    console.error('Failed to fetch documents:', error);
  }
});

const createNewDocument = () => {
  router.push(`/documents/${uuidV4()}`);
};
</script>