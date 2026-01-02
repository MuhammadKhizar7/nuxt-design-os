<script setup lang="ts">
import { ref } from 'vue'
import { useMockData } from '~/composables/useMockData'
import AppShell from '~/components/shell/AppShell.vue'
import AgentStatusCard from '~/components/shell/AgentStatusCard.vue'
import SuggestionList from '~/components/shell/SuggestionList.vue'
import TeamMember from '~/components/shell/TeamMember.vue'
import ChatPanel from '~/components/shell/ChatPanel.vue'

const { agents, suggestions, team } = useMockData()

const navItems = [
  { label: 'Dashboard', href: '/dashboard', isActive: true },
  { label: 'Notes', href: '/notes' },
  { label: 'Research', href: '/research' },
  { label: 'Settings', href: '/settings' }
]

const currentUser = {
  name: 'Alex Morgan',
  avatarUrl: 'https://i.pravatar.cc/150?u=0'
}

const selectedTeamMember = ref<typeof team.value[0] | null>(null)

const handleApprove = (id: string | number) => {
  // In a real app, this would trigger an API call
  suggestions.value = suggestions.value.filter(s => s.id !== id)
}

const handleDismiss = (id: string | number) => {
  suggestions.value = suggestions.value.filter(s => s.id !== id)
}
</script>

<template>
  <AppShell :navigation-items="navItems" :user="currentUser" :has-notifications="suggestions.length > 0">
    <div class="p-6 max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-heading font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <div class="text-sm text-slate-500">{{ new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) }}</div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Welcome / Stats Card -->
        <div class="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UIcon name="i-lucide-activity" class="w-24 h-24 text-indigo-500" />
          </div>
          <h2 class="text-lg font-bold mb-2 relative z-10">Welcome back, Alex!</h2>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-6 relative z-10 max-w-xs">
            You have <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ suggestions.length }} new AI suggestions</span> and {{ agents.filter(a => a.status === 'working').length }} active research agents running.
          </p>
          <div class="flex gap-3 relative z-10">
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none">
              New Note
            </button>
            <button class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              View Reports
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-slate-400" />
            Recent Activity
          </h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3 text-sm group cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <UIcon name="i-lucide-file-text" class="w-4 h-4" />
              </div>
              <div>
                <div class="font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Project Alpha Specs</div>
                <div class="text-slate-500 text-xs">Edited 2 hours ago</div>
              </div>
            </div>
            <div class="flex items-center gap-3 text-sm group cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <UIcon name="i-lucide-mic" class="w-4 h-4" />
              </div>
              <div>
                <div class="font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Meeting Notes</div>
                <div class="text-slate-500 text-xs">Recorded yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Panel Slot -->
    <template #ai-panel>
      <div class="space-y-4">
        <div v-if="agents.length > 0">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Agents</div>
          <AgentStatusCard v-for="agent in agents" :key="agent.id" :agent-name="agent.name" :status="agent.status" :task="agent.task" :progress="agent.progress" />
        </div>
        
        <div v-if="suggestions.length > 0">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Suggestions</div>
          <SuggestionList :items="suggestions" @approve="handleApprove" @dismiss="handleDismiss" />
        </div>
      </div>
    </template>

    <!-- Team Panel Slot -->
    <template #team-panel>
      <div v-if="!selectedTeamMember" class="space-y-1">
        <TeamMember v-for="member in team" :key="member.id" :name="member.name" :role="member.role" :status="member.status" :avatar-url="member.avatarUrl" @click="selectedTeamMember = member" />
      </div>
      <ChatPanel v-else :recipient="selectedTeamMember" @close="selectedTeamMember = null" />
    </template>
  </AppShell>
</template>