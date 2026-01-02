<template>
  <UButton
    :icon="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
    color="gray"
    variant="ghost"
    size="sm"
    aria-label="Toggle theme"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
