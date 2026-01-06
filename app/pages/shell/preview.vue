<script setup lang="ts">
import AppShell from '@/components/shell/AppShell.vue'

definePageMeta({
  layout: false
})


const user = {
  name: 'Alex Morgan',
  avatarUrl: undefined,
}

</script>

<template>
  <AppShell :user="user" @logout="() => console.log('Logout')">
    <div class="p-8">
      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white dark:bg-slate-950/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <h1 class="text-2xl font-bold font-heading mb-4 text-slate-800 dark:text-slate-200">Content Area</h1>
          <p class="text-slate-600 dark:text-slate-400">
            This is where the content for each section will be rendered. The shell provides the consistent navigation
            and layout around this central view.
          </p>
        </div>
      </div>
    </div>
  </AppShell>
</template>