<script setup lang="ts">
import AppShell from '@/components/shell/AppShell.vue'
import { ref } from 'vue'

useHead({
  title: 'Notica Shell Preview',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap', rel: 'stylesheet' },
  ]
})

const navigationItems = ref([
  { label: 'Note Organization & Visualization', href: '/sections/visualization', isActive: true },
  { label: 'Core Note Capture', href: '/sections/capture' },
  { label: 'AI-Powered Insights', href: '/sections/insights' },
])

const user = {
  name: 'Alex Morgan',
  avatarUrl: undefined,
}

function handleNavigate(href: string) {
  console.log('Navigate to:', href)
  navigationItems.value = navigationItems.value.map(item => ({
    ...item,
    isActive: item.href === href
  }))
}
</script>

<template>
  <AppShell
    :navigation-items="navigationItems"
    :user="user"
    @navigate="handleNavigate"
    @logout="() => console.log('Logout')"
  >
    <div class="p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-slate-950/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h1 class="text-2xl font-bold font-heading mb-4 text-slate-800 dark:text-slate-200">Content Area</h1>
          <p class="text-slate-600 dark:text-slate-400">
            This is where the content for each section will be rendered. The shell provides the consistent navigation and layout around this central view.
          </p>
          <div class="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h3 class="font-mono text-sm text-slate-700 dark:text-slate-300">Active Page: <span class="text-teal-600 dark:text-teal-400">{{ navigationItems.find(i => i.isActive)?.label }}</span></h3>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>