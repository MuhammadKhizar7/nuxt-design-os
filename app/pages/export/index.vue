<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProductData } from '~/composables/useProductData'

const {
  hasProductOverview,
  hasProductRoadmap,
  hasDataModel,
  hasDesignSystem,
  hasShell,
  exportZipAvailable,
  exportZipUrl,
  sectionStats
} = useProductData()

const hasSections = computed(() => sectionStats.withScreenDesigns > 0)
const requiredComplete = computed(() => hasProductOverview && hasProductRoadmap && hasSections.value)

const exportDescription = computed(() => exportZipAvailable.value
  ? 'Your design package is ready for implementation. Download it to begin building with your AI coding assistant.'
  : 'Generate a comprehensive handoff package containing all design specifications, data models, and screen designs.'
)

const exportItems = [
  {
    title: "Ready-to-Use Prompts",
    description: "Pre-written prompts to copy/paste into your coding agent.",
    items: ['one-shot-prompt.md', 'section-prompt.md']
  },
  {
    title: "Instructions",
    description: "Detailed implementation guides for your coding agent.",
    items: ['product-overview.md', 'one-shot-instructions.md', 'incremental/']
  },
  {
    title: "Design System",
    description: "Colors, typography, and styling configuration.",
    items: ['CSS tokens', 'Tailwind config', 'Font setup']
  },
  {
    title: "Data Model",
    description: "Entity definitions and sample data.",
    items: ['TypeScript types', 'Sample data', 'Entity docs']
  },
  {
    title: "Components",
    description: "Vue components and visual references.",
    items: ['Shell components', 'Section components', 'Screenshots']
  },
  {
    title: "Test Instructions",
    description: "Framework-agnostic test specs.",
    items: ['tests.md per section', 'User flows']
  }
]

import { forceExportAvailable } from '~/composables/useProductData'

const isGenerating = ref(false)
const toast = useToast()

onMounted(() => {
  isGenerating.value = false
})

function copyCommand() {
  navigator.clipboard.writeText('/export-product')
  toast.add({ title: 'Copied to clipboard!', color: 'green' })
}

async function simulateExport() {
  isGenerating.value = true

  try {
    // Simulate network delay / processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate successful generation for current session
    forceExportAvailable.value = true

    try {
      toast.add({ title: 'Export Package Generated!', description: 'Ready for download.', color: 'green' })
    } catch (e) {
      console.error('Toast error (ignored):', e)
    }
  } catch (error) {
    console.error('Export simulation failed:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
    <!-- Header -->
    <header class="space-y-4">
      <div
        class="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold uppercase tracking-widest text-xs">
        <UIcon name="i-lucide-package" class="w-4 h-4" />
        Product Handoff
      </div>
      <h1 class="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-heading">
        {{ exportZipAvailable ? 'Implementation Ready' : 'Project Export' }}
      </h1>
      <p class="text-xl text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
        {{ exportDescription }}
      </p>
    </header>

    <!-- Readiness Checklist -->
    <section v-if="!exportZipAvailable || !requiredComplete">
      <UCard
        class="overflow-hidden border-stone-200 dark:border-stone-800 shadow-sm ring-1 ring-stone-200 dark:ring-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-heading">
              <div :class="[
                'w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                requiredComplete ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
              ]">
                <UIcon :name="requiredComplete ? 'i-lucide-check' : 'i-lucide-alert-circle'"
                  :class="requiredComplete ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'"
                  class="w-4 h-4" />
              </div>
              {{ requiredComplete ? 'Checklist Complete' : 'Readiness Checklist' }}
            </h2>
            <UBadge :color="requiredComplete ? 'green' : 'amber'" variant="subtle" size="lg">
              {{ requiredComplete ? 'Ready' : 'In Progress' }}
            </UBadge>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 py-4">
          <div v-for="item in [
            { label: 'Product Overview', done: hasProductOverview, icon: 'i-lucide-info' },
            { label: 'Product Roadmap', done: hasProductRoadmap, icon: 'i-lucide-map' },
            { label: 'Data Model', done: hasDataModel, icon: 'i-lucide-database' },
            { label: 'Design System', done: hasDesignSystem, icon: 'i-lucide-palette' },
            { label: 'Application Shell', done: hasShell, icon: 'i-lucide-layout' },
            { label: `Screen Designs (${sectionStats.withScreenDesigns}/${sectionStats.total})`, done: hasSections, icon: 'i-lucide-monitor' }
          ]" :key="item.label"
            class="flex items-center justify-between p-3 rounded-xl border border-transparent transition-all"
            :class="item.done ? 'bg-green-50/50 dark:bg-green-900/5' : 'bg-stone-50/50 dark:bg-stone-800/20'">
            <div class="flex items-center gap-3">
              <UIcon :name="item.icon" class="w-5 h-5" :class="item.done ? 'text-green-500' : 'text-stone-400'" />
              <span class="text-sm font-semibold"
                :class="item.done ? 'text-stone-900 dark:text-stone-100' : 'text-stone-500 dark:text-stone-600'">
                {{ item.label }}
              </span>
            </div>
            <div :class="[
              'w-5 h-5 rounded-full flex items-center justify-center transition-all scale-110',
              item.done ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-stone-200 dark:bg-stone-800 text-transparent'
            ]">
              <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </UCard>
    </section>

    <!-- Export Actions -->
    <section v-if="requiredComplete" class="space-y-8">
      <!-- Download Box -->
      <UCard v-if="exportZipAvailable && exportZipUrl"
        class="bg-gradient-to-br from-green-500 to-emerald-600 border-none shadow-2xl shadow-green-500/20 text-white overflow-hidden relative">
        <UIcon name="i-lucide-package" class="absolute -right-12 -top-12 w-64 h-64 opacity-10 rotate-12" />
        <div class="flex flex-col md:flex-row items-center gap-8 p-4 relative z-10">
          <div class="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <UIcon name="i-lucide-package-check" class="w-12 h-12" />
          </div>
          <div class="flex-1 text-center md:text-left space-y-1">
            <h3 class="text-3xl font-black font-heading tracking-tight">Handoff Package Ready</h3>
            <p class="text-green-50 text-lg font-medium">v1.0.0 • Generated on {{ new Date().toLocaleDateString() }}</p>
          </div>
          <a :href="exportZipUrl" download="product-plan.zip" target="_blank"
            class="font-black px-10 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all text-green-600 bg-white flex items-center gap-2 shadow-lg shadow-green-900/10 decoration-none">
            <UIcon name="i-lucide-download" class="w-5 h-5" />
            Download ZIP
          </a>
        </div>
      </UCard>

      <!-- Command Box -->
      <div v-else class="space-y-6">
        <div
          class="bg-stone-900 dark:bg-black rounded-[2.5rem] p-12 border border-white/5 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div class="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none" />

          <div
            class="w-24 h-24 rounded-[2rem] bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto relative z-10">
            <UIcon name="i-lucide-terminal" class="w-12 h-12 text-primary-500" />
          </div>

          <div class="space-y-3 relative z-10">
            <h3 class="text-3xl font-black text-white font-heading tracking-tight">Generate Handoff Assets</h3>
            <p class="text-stone-400 text-lg max-w-md mx-auto">Your project is ready! Run this command to bundle all
              prompts
              and components.</p>
          </div>

          <div
            class="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-xl flex items-center justify-between group hover:border-primary-500/50 transition-colors relative z-10">
            <span class="text-primary-400 font-bold">/export-product</span>
            <UButton variant="ghost" color="white" icon="i-lucide-copy" size="sm"
              class="opacity-30 group-hover:opacity-100 transition-opacity" @click="copyCommand" />
          </div>

          <div class="relative z-10 flex flex-col items-center">
            <!-- DEBUG INFO -->
            <!-- <div class="text-xs text-red-500 bg-black/50 p-2 mb-2 absolute -top-12">
               Gen: {{ isGenerating }} | Force: {{ forceExportAvailable }} | Zip: {{ exportZipAvailable }}
             </div> -->

            <button type="button"
              class="font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all text-stone-900 bg-white flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 opacity-100 cursor-pointer"
              @click="simulateExport">
              <UIcon v-if="isGenerating" name="i-lucide-loader-2" class="w-5 h-5 animate-spin" />
              <UIcon v-else name="i-lucide-package" class="w-5 h-5" />
              {{ isGenerating ? 'Generating...' : 'Generate Export Package' }}
            </button>
            <p class="text-xs text-stone-500 mt-4">(Simulates running the command)</p>
          </div>
        </div>
      </div>

      <!-- Manifest -->
      <div class="space-y-8 pt-8">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
            <UIcon name="i-lucide-folder-tree" class="w-4 h-4" />
            Included Assets
          </h3>
          <div class="h-px flex-1 bg-stone-100 dark:bg-stone-800 ml-4" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard v-for="item in exportItems" :key="item.title"
            class="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-900/10">
            <h4 class="font-black text-stone-900 dark:text-stone-100 mb-2 font-heading tracking-tight">{{ item.title }}
            </h4>
            <p class="text-xs text-stone-500 mb-6 leading-relaxed font-medium">{{ item.description }}</p>
            <ul class="space-y-2">
              <li v-for="file in item.items" :key="file"
                class="flex items-center gap-2 text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                <div class="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {{ file }}
              </li>
            </ul>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Footer Guide -->
    <section class="relative pt-12">
      <div class="bg-stone-900 rounded-[3rem] p-10 lg:p-16 text-white overflow-hidden group shadow-2xl">
        <UIcon name="i-lucide-zap"
          class="absolute -right-20 -bottom-20 w-96 h-96 text-white/5 group-hover:scale-110 transition-transform duration-1000 rotate-12" />

        <div class="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <UBadge color="primary" variant="solid" size="lg" class="rounded-full">Implementation Guide</UBadge>
              <h2 class="text-4xl md:text-5xl font-black font-heading tracking-tight italic">Scale with Confidence.</h2>
              <p class="text-stone-400 text-xl leading-relaxed">Our handoff process ensures that your AI coding agent
                builds
                exactly what you've designed here.</p>
            </div>
            <UButton size="xl" color="white" variant="link" icon="i-lucide-book-open" class="font-bold -ml-4">Read
              Documentation</UButton>
          </div>

          <div class="grid gap-8">
            <div
              class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-colors space-y-4 shadow-inner">
              <h3 class="text-xl font-bold flex items-center gap-3 font-heading">
                <div class="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                  <UIcon name="i-lucide-layers" class="w-6 h-6 text-primary-500" />
                </div>
                Incremental Flow
              </h3>
              <p class="text-stone-400 leading-relaxed font-medium">Build foundation, shell, and sections separately.
                Perfect for production-grade applications.</p>
            </div>
            <div
              class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-colors space-y-4 shadow-inner">
              <h3 class="text-xl font-bold flex items-center gap-3 font-heading">
                <div class="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                  <UIcon name="i-lucide-zap-off" class="w-6 h-6 text-amber-500" />
                </div>
                One-Shot Sprint
              </h3>
              <p class="text-stone-400 leading-relaxed font-medium">Use our mega-prompt to generate the entire
                application
                structure in minutes. Best for MVPs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.font-heading {
  font-family: 'DM Sans', sans-serif;
}

.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
