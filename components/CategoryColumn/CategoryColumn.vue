<template>
  <div
      v-if="category"
      class="category-column"
      @dragover="onDragOver"
      @drop="onDrop($event, category.id)"
  >
    <div class="category-header" :style="{ background: getHeaderGradient() }">
      <div class="header-content">
        <div class="header-main">
          <div class="status-dot"></div>
          <h3 class="category-title">{{ category.name }}</h3>
        </div>
        <div class="header-actions">
          <span class="task-count">{{ categoryTasks.length }}</span>
          <button class="header-menu-btn">
            <i class="ri-more-2-line"></i>
          </button>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-label">Progression</span>
          <span class="progress-value">{{ getProgressPercentage() }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: getProgressPercentage() + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="category-body">
      <div class="tasks-container">
        <TaskCard
            v-for="task in categoryTasks"
            :key="task.id"
            :task="task"
            :categoryId="category.id"
            :priority="getTaskPriority(task)"
            :assignee="getTaskAssignee(task)"
            :deadline="getTaskDeadline(task)"
            :tags="getTaskTags(task)"
        />

        <div v-if="isAddingTask" class="add-task-form">
          <div class="form-header">
            <h4>Nouvelle tâche</h4>
            <button @click="cancelAddTask" class="close-btn">
              <i class="ri-close-line"></i>
            </button>
          </div>

          <div class="form-body">
            <input
                v-model="newTaskLocal.title"
                placeholder="Titre de la tâche..."
                class="task-title-input"
                @keyup.enter="handleAddTask"
            />
            <textarea
                v-model="newTaskLocal.description"
                placeholder="Description détaillée..."
                class="task-description-input"
                rows="3"
            ></textarea>

            <div class="form-actions">
              <button @click="handleAddTask" class="add-btn">
                <i class="ri-check-line"></i>
                Ajouter
              </button>
              <button @click="cancelAddTask" class="cancel-btn">
                Annuler
              </button>
            </div>
          </div>
        </div>

        <button
            v-else
            @click="startAddingTask"
            class="add-task-btn"
        >
          <i class="ri-add-line"></i>
          <span>Ajouter une tâche</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType, computed } from 'vue';
import { type Category, type Task } from '~/types/type';
import { useKanban } from '~/composables/composable';
import TaskCard from '~/components/TaskCard/TaskCard.vue';

const props = defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true
  },
  categoryIndex: {
    type: Number,
    default: 0
  }
});

const { addTask } = useKanban();

const category = computed(() => {
  if (props.category && 'id' in props.category && 'name' in props.category && 'tasks' in props.category) {
    return props.category as Category;
  }
  return null;
});

const categoryTasks = computed(() => {
  return category.value?.tasks || [];
});

const isAddingTask = ref(false);
const newTaskLocal = ref<Omit<Task, 'id'> & { categoryId: number | null }>({
  categoryId: null,
  title: '',
  description: ''
});

const headerColors = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
];

const priorities = ['high', 'medium', 'low'];
const assignees = [
  { name: 'Alice', avatar: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' },
  { name: 'Bob', avatar: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' },
  { name: 'Charlie', avatar: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }
];

const startAddingTask = () => {
  if (category.value) {
    isAddingTask.value = true;
    newTaskLocal.value = {
      categoryId: category.value.id,
      title: '',
      description: ''
    };
  }
};

const handleAddTask = () => {
  if (newTaskLocal.value.categoryId !== null && newTaskLocal.value.title.trim()) {
    addTask(newTaskLocal.value.categoryId, newTaskLocal.value.title, newTaskLocal.value.description);
    isAddingTask.value = false;
    newTaskLocal.value = {
      categoryId: category.value?.id ?? null,
      title: '',
      description: ''
    };
  }
};

const cancelAddTask = () => {
  isAddingTask.value = false;
  newTaskLocal.value = {
    categoryId: category.value?.id ?? null,
    title: '',
    description: ''
  };
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const onDrop = (e: DragEvent, categoryId: number) => {
  e.preventDefault();
};

const getHeaderGradient = () => {
  return headerColors[props.categoryIndex % headerColors.length];
};

const getProgressPercentage = () => {
  const total = categoryTasks.value.length;
  if (total === 0) return 0;
  const completed = Math.floor(total * (0.2 + Math.random() * 0.6));
  return Math.round((completed / total) * 100);
};

const getTaskPriority = (task: Task) => {
  return priorities[task.id % priorities.length];
};

const getTaskAssignee = (task: Task) => {
  return assignees[task.id % assignees.length];
};

const getTaskDeadline = (task: Task) => {
  const days = ['2j', '5j', '1sem', '3j', '1j', '4j'];
  return days[task.id % days.length];
};

const getTaskTags = (task: Task) => {
  const allTags = [
    { name: 'Urgent', color: 'bg-red-100 text-red-700' },
    { name: 'Design', color: 'bg-blue-100 text-blue-700' },
    { name: 'Backend', color: 'bg-green-100 text-green-700' },
    { name: 'Frontend', color: 'bg-orange-100 text-orange-700' },
    { name: 'Docs', color: 'bg-purple-100 text-purple-700' },
    { name: 'Bug', color: 'bg-red-100 text-red-700' }
  ];

  const numTags = Math.min(2, Math.floor(Math.random() * 3) + 1);
  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};
</script>

<style scoped>
.category-column {
  min-width: 320px;
  max-width: 320px;
  background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 200px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-column:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.category-header {
  padding: 20px;
  border-radius: 16px 16px 0 0;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-main {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  min-width: 32px;
  text-align: center;
}

.header-menu-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 18px;
}

.header-menu-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.progress-section {
  margin-top: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.progress-value {
  font-size: 12px;
  color: white;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.category-body {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tasks-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.tasks-container::-webkit-scrollbar {
  width: 6px;
}

.tasks-container::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 3px;
}

.tasks-container::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.add-task-form {
  background: white;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.form-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 16px;
}

.close-btn:hover {
  color: #374151;
  background: rgba(99, 102, 241, 0.1);
}

.form-body {
  padding: 20px;
}

.task-title-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(209, 213, 219, 0.8);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background: #fafafa;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.task-title-input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.task-title-input::placeholder {
  color: #9ca3af;
}

.task-description-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(209, 213, 219, 0.8);
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #fafafa;
  margin-bottom: 16px;
  resize: none;
  line-height: 1.5;
  transition: all 0.2s ease;
}

.task-description-input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.task-description-input::placeholder {
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 8px;
}

.add-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.add-task-btn {
  width: 100%;
  background: rgba(99, 102, 241, 0.05);
  border: 2px dashed rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.add-task-btn:hover {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.5);
  color: #374151;
  transform: translateY(-1px);
}

.add-task-btn i {
  font-size: 18px;
}

@media (max-width: 768px) {
  .category-column {
    min-width: 280px;
    max-width: 280px;
  }

  .category-header {
    padding: 16px;
  }

  .category-title {
    font-size: 16px;
  }

  .category-body {
    padding: 12px;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.add-task-form {
  animation: slideIn 0.3s ease-out;
}
</style>