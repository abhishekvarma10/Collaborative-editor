<template>
  <div class="editor-page-container">
    <!-- Title + Download Controls -->
    <div class="title-bar">
      <v-text-field
        v-model="documentTitle"
        label="Document Title"
        variant="solo"
        class="title-field"
        hide-details
        @update:model-value="saveTitle"
      ></v-text-field>

      <v-btn
        color="primary"
        class="ml-4"
        @click="downloadDocument('pdf')"
      >
        <v-icon left>mdi-file-pdf-box</v-icon>
        PDF
      </v-btn>

      <v-btn
        color="secondary"
        class="ml-2"
        @click="downloadDocument('doc')"
      >
        <v-icon left>mdi-file-word-box</v-icon>
        Word
      </v-btn>
    </div>

    <!-- Quill Editor -->
    <div class="quill-editor-container">
      <div id="editor"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash-es';

const documentTitle = ref('');
const quill = ref(null);
const socket = ref(null);
const route = useRoute();

// -------------------- Quill + Socket Setup --------------------
onMounted(() => {
  quill.value = new Quill('#editor', {
    theme: 'snow',
    modules: { toolbar: true },
  });
  quill.value.disable();
  quill.value.setText('Loading...');

  socket.value = io('http://localhost:3001');
  const { id: documentId } = route.params;

  socket.value.emit('join-document', documentId);

  socket.value.on('load-document', (document) => {
    quill.value.setContents(document.data);
    documentTitle.value = document.title;
    quill.value.enable();
  });

  quill.value.on('text-change', (delta, oldDelta, source) => {
    if (source !== 'user') return;
    socket.value.emit('send-changes', delta);
  });

  setInterval(() => {
    if (!quill.value) return;
    socket.value.emit('save-document', quill.value.getContents());
  }, 2000);

  socket.value.on('receive-changes', (delta) => {
    quill.value.updateContents(delta);
  });
});

// -------------------- Save Title (Debounced) --------------------
const saveTitle = debounce(() => {
  if (!socket.value) return;
  socket.value.emit('save-title', documentTitle.value);
}, 500);

// -------------------- Download Document --------------------
const downloadDocument = (format) => {
  const { id: documentId } = route.params;
  window.open(`http://localhost:3001/api/documents/${documentId}/download?format=${format}`);
};
</script>

<style>
.editor-page-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Title row with download buttons */
.title-bar {
  display: flex;
  align-items: center;
  max-width: 8.5in;
  width: 100%;
  margin-top: 1rem;
}

.title-field {
  flex: 1;
}

.quill-editor-container {
  max-width: 8.5in;
  width: 100%;
  min-height: 11in;
  margin: 1rem 0;
  padding: 1in;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 4px;
}

#editor {
  height: 100%;
}

.ql-toolbar {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  border-left: none !important;
  border-right: none !important;
  border-top: none !important;
}
</style>
