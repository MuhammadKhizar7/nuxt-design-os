<template>
  <div class="h-screen w-full overflow-hidden bg-white dark:bg-stone-950">
     <AppShell>
       <div class="p-8">
         <div class="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg h-96 flex items-center justify-center">
           <p class="text-stone-400 font-medium">Main Content Area</p>
         </div>
       </div>
     </AppShell>
  </div>
</template>

<script setup lang="ts">
import AppShell from '~/components/shell/AppShell.vue'

definePageMeta({
  layout: false
})
</script>
