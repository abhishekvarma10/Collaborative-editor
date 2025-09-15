<template>
  <div class="quill-editor-container">
    <div id="editor"></div>
  </div>
</template>

// frontend/src/components/TextEditor.vue
<script setup>
import { onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router'; // Import useRoute

onMounted(() => {
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: { toolbar: true },
  });
  quill.disable();
  quill.setText('Loading...');

  const socket = io('http://localhost:3001');
  const route = useRoute(); // Get the current route information

  // Get the document ID from the URL parameter
  const { id: documentId } = route.params;

  // Tell the server we want to join this document's room.
  socket.emit('join-document', documentId);
  
  // ... the rest of the script is the same ...
  socket.on('load-document', (document) => {
    quill.setContents(document);
    quill.enable();
  });

  quill.on('text-change', (delta, oldDelta, source) => {
    if (source !== 'user') return;
    socket.emit('send-changes', delta);
  });
  
  socket.on('receive-changes', (delta) => {
    quill.updateContents(delta);
  });
});
</script>
<style>
/* Remove the old .container style */

.quill-editor-container {
  max-width: 8.5in;
  min-height: 11in;
  margin: 1rem auto;
  padding: 1in;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 4px;
}

#editor {
  height: 100%; /* The container will now control the height */
}

/* Style the Quill toolbar to be sticky */
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