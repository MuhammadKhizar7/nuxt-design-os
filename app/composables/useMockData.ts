import { ref } from 'vue'

export const useMockData = () => {
  const agents = ref([
    { id: 1, name: 'Research Agent', status: 'working' as const, task: 'Analyzing market trends for Q3', progress: 45 },
    { id: 2, name: 'Design Bot', status: 'waiting_approval' as const, task: 'Generated 3 new logo concepts' },
    { id: 3, name: 'Copywriter', status: 'idle' as const, task: 'Waiting for new brief' }
  ])

  const suggestions = ref([
    { id: 1, title: 'Optimize Images', description: 'Compressing hero images could save 2.4MB on load.', type: 'optimization' as const },
    { id: 2, title: 'New Layout Idea', description: 'Try a grid layout for the portfolio section.', type: 'idea' as const },
    { id: 3, title: 'Fix Contrast', description: 'Header text contrast is too low for accessibility.', type: 'fix' as const }
  ])

  const team = ref([
    { id: 1, name: 'Sarah Chen', role: 'Product Designer', status: 'online' as const, avatarUrl: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Mike Ross', role: 'Frontend Dev', status: 'busy' as const, avatarUrl: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Anna Smith', role: 'Product Manager', status: 'away' as const, avatarUrl: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'David Kim', role: 'Backend Dev', status: 'offline' as const, avatarUrl: 'https://i.pravatar.cc/150?u=4' }
  ])

  return { agents, suggestions, team }
}