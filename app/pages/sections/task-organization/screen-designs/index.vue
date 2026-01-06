<script setup lang="ts">
import { AppShell } from '@/components/shell/AppShell.vue'
import TaskOrganization from '@/components/sections/task-organization/TaskOrganization.vue'
import { useSectionData } from '@/composables/useSectionData'

const { data: sectionData } = await useSectionData('task-organization')
const tasks = ref(sectionData.tasks)
const categories = ref(sectionData.categories)
const priorities = ref(sectionData.priorities)

const handleAddCategory = (name: string) => {
  const newCategory = {
    id: `cat-${Date.now()}`,
    name,
    color: 'blue',
    taskCount: 0
  }
  categories.value.push(newCategory)
  console.log('Added category:', name)
}

const handleEditCategory = (id: string, name: string) => {
  const category = categories.value.find(cat => cat.id === id)
  if (category) {
    category.name = name
    console.log('Edited category:', id, name)
  }
}

const handleDeleteCategory = (id: string) => {
  categories.value = categories.value.filter(cat => cat.id !== id)
  console.log('Deleted category:', id)
}

const handleAssignCategory = (taskId: string, categoryId: string) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.categoryId = categoryId
    console.log('Assigned category:', taskId, categoryId)
  }
}

const handleSetPriority = (taskId: string, priorityId: string) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.priorityId = priorityId
    console.log('Set priority:', taskId, priorityId)
  }
}

const handleToggleTask = (id: string) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.completed = !task.completed
    console.log('Toggled task:', id, task.completed)
  }
}

const handleDeleteTask = (id: string) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
  console.log('Deleted task:', id)
}

const navigationItems = [
  { label: 'Task Management', href: '/task-management' },
  { label: 'Task Organization', href: '/task-organization', isActive: true },
  { label: 'Task Persistence', href: '/task-persistence' },
]

const user = {
  name: 'Alex Morgan',
  avatarUrl: undefined,
}
</script>

<template>
  <AppShell
    :navigationItems="navigationItems"
    :user="user"
    @navigate="(href) => console.log('Navigate to:', href)"
    @logout="() => console.log('Logout')"
  >
    <TaskOrganization
      :tasks="tasks"
      :categories="categories"
      :priorities="priorities"
      @add-category="handleAddCategory"
      @edit-category="handleEditCategory"
      @delete-category="handleDeleteCategory"
      @assign-category="handleAssignCategory"
      @set-priority="handleSetPriority"
      @toggle-task="handleToggleTask"
      @delete-task="handleDeleteTask"
    />
  </AppShell>
</template>