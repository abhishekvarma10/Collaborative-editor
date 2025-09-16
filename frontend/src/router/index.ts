// frontend/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import TextEditor from '../components/TextEditor.vue'
import Dashboard from '../views/Dashboard.vue' // <-- IMPORT THE DASHBOARD

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // The home page will now show the dashboard
      path: '/',
      name: 'dashboard',
      component: Dashboard // <-- USE THE DASHBOARD COMPONENT
    },
    {
      // The route for a specific document remains the same
      path: '/documents/:id',
      name: 'document',
      component: TextEditor
    }
  ]
})

export default router