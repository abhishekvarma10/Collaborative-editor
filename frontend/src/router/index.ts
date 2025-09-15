// frontend/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { v4 as uuidV4 } from 'uuid'
import TextEditor from '../components/TextEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // The home page will redirect to a new, random document
      path: '/',
      redirect: () => ({ path: `/documents/${uuidV4()}` })
    },
    {
      // This is the route for a specific document
      path: '/documents/:id',
      name: 'document',
      component: TextEditor
    }
  ]
})

export default router