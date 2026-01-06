<script setup lang="ts">
import { AppShell } from '@/components/shell/AppShell.vue'
import TaskPersistence from '@/components/sections/task-persistence/TaskPersistence.vue'
import { useSectionData } from '@/composables/useSectionData'

const { data: sectionData } = await useSectionData('task-persistence')
const backups = ref(sectionData.backups)
const operations = ref(sectionData.operations)
const statistics = ref(sectionData.statistics)

const handleSaveTasks = () => {
  const newOperation = {
    id: `op-${Date.now()}`,
    type: 'save',
    status: 'success',
    timestamp: new Date().toISOString(),
    message: `Successfully saved ${statistics.value.totalTasks} tasks to local storage`,
    taskCount: statistics.value.totalTasks
  }
  operations.value.unshift(newOperation)
  
  statistics.value.lastSaved = new Date().toISOString()
  
  // Create new backup
  const newBackup = {
    id: `backup-${Date.now()}`,
    name: `Auto backup - ${new Date().toLocaleDateString()}`,
    timestamp: new Date().toISOString(),
    taskCount: statistics.value.totalTasks,
    categoryCount: statistics.value.totalCategories,
    fileSize: `${(Math.random() * 5 + 1).toFixed(1)} KB`,
    description: 'Automatic backup on save'
  }
  backups.value.unshift(newBackup)
  
  console.log('Saved tasks')
}

const handleLoadTasks = () => {
  const newOperation = {
    id: `op-${Date.now()}`,
    type: 'load',
    status: 'success',
    timestamp: new Date().toISOString(),
    message: 'Successfully loaded tasks from backup',
    taskCount: 8
  }
  operations.value.unshift(newOperation)
  
  statistics.value.lastLoaded = new Date().toISOString()
  
  console.log('Loaded tasks')
}

const handleExportTasks = (format: 'json' | 'csv') => {
  const fileName = `todo_backup_${new Date().toISOString().split('T')[0]}.${format}`
  const newOperation = {
    id: `op-${Date.now()}`,
    type: 'export',
    status: 'success',
    timestamp: new Date().toISOString(),
    message: `Exported tasks to ${fileName}`,
    taskCount: statistics.value.totalTasks,
    fileName
  }
  operations.value.unshift(newOperation)
  
  console.log('Exported tasks as:', format)
}

const handleImportTasks = (file: File) => {
  const newOperation = {
    id: `op-${Date.now()}`,
    type: 'import',
    status: Math.random() > 0.2 ? 'success' : 'error',
    timestamp: new Date().toISOString(),
    message: Math.random() > 0.2 
      ? `Successfully imported ${file.name}`
      : 'Invalid file format - expected JSON',
    fileName: file.name,
    error: Math.random() <= 0.2 ? 'File parsing failed: unexpected token at line 3' : undefined
  }
  operations.value.unshift(newOperation)
  
  console.log('Imported file:', file.name)
}

const handleRestoreBackup = (backupId: string) => {
  const backup = backups.value.find(b => b.id === backupId)
  if (backup) {
    const newOperation = {
      id: `op-${Date.now()}`,
      type: 'load',
      status: 'success',
      timestamp: new Date().toISOString(),
      message: `Restored from backup: ${backup.name}`,
      taskCount: backup.taskCount
    }
    operations.value.unshift(newOperation)
    
    statistics.value.totalTasks = backup.taskCount
    statistics.value.lastLoaded = new Date().toISOString()
    
    console.log('Restored backup:', backupId)
  }
}

const handleDeleteBackup = (backupId: string) => {
  backups.value = backups.value.filter(b => b.id !== backupId)
  console.log('Deleted backup:', backupId)
}

const navigationItems = [
  { label: 'Task Management', href: '/task-management' },
  { label: 'Task Organization', href: '/task-organization' },
  { label: 'Task Persistence', href: '/task-persistence', isActive: true },
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
    <TaskPersistence
      :backups="backups"
      :operations="operations"
      :statistics="statistics"
      @save-tasks="handleSaveTasks"
      @load-tasks="handleLoadTasks"
      @export-tasks="handleExportTasks"
      @import-tasks="handleImportTasks"
      @restore-backup="handleRestoreBackup"
      @delete-backup="handleDeleteBackup"
    />
  </AppShell>
</template>