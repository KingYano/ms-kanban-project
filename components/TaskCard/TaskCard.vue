<template>
  <div
      :class="[
      'task-card',
      'group',
      `priority-${priority}`,
      { 'dragging': isDragging }
    ]"
      draggable="true"
      @dragstart="onDragStart($event, categoryId, task.id)"
      @dragend="onDragEnd"
  >
    <div class="task-header">
      <h4 class="task-title">{{ task.title }}</h4>
      <div class="task-actions">
        <button @click="editTask(categoryId, task.id)" class="action-btn edit-btn">
          <i class="ri-edit-line"></i>
        </button>
        <button @click="deleteTask(categoryId, task.id)" class="action-btn delete-btn">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    </div>

    <p v-if="task.description" class="task-description">{{ task.description }}</p>

    <div v-if="tags && tags.length > 0" class="task-tags">
      <span
          v-for="tag in tags"
          :key="tag.name"
          :class="['tag', tag.color]"
      >
        {{ tag.name }}
      </span>
    </div>

    <div class="task-footer">
      <div class="task-meta">
        <div v-if="deadline" class="deadline-info">
          <i class="ri-time-line"></i>
          <span>{{ deadline }}</span>
        </div>
      </div>

      <div v-if="assignee" class="assignee-avatar" :style="{ background: assignee.avatar }">
        {{ assignee.name.charAt(0) }}
      </div>
    </div>

    <div class="priority-indicator"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue';
import { type Task } from '~/types/type';
import { useKanban } from '~/composables/composable';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  },
  categoryId: {
    type: Number,
    required: true
  },
  priority: {
    type: String as PropType<'high' | 'medium' | 'low'>,
    default: 'medium'
  },
  assignee: {
    type: Object as PropType<{ name: string; avatar: string }>,
    default: null
  },
  deadline: {
    type: String,
    default: null
  },
  tags: {
    type: Array as PropType<Array<{ name: string; color: string }>>,
    default: () => []
  }
});

const { editTask, deleteTask } = useKanban();

const isDragging = ref(false);

const onDragStart = (e: DragEvent, categoryId: number, taskId: number) => {
  isDragging.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      sourceCategory: categoryId,
      taskId: taskId
    }));
    e.dataTransfer.effectAllowed = 'move';
  }
};

const onDragEnd = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.task-card {
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: grab;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.task-card:active {
  cursor: grabbing;
}

.task-card.dragging {
  opacity: 0.6;
  transform: rotate(5deg) scale(0.95);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.priority-high {
  border-left: 4px solid #ef4444;
}

.priority-medium {
  border-left: 4px solid #f59e0b;
}

.priority-low {
  border-left: 4px solid #10b981;
}

.priority-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  opacity: 0.8;
}

.priority-high .priority-indicator {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
}

.priority-medium .priority-indicator {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.priority-low .priority-indicator {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

.task-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.group:hover .task-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.edit-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.1);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.task-description {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.5;
  word-break: break-word;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  white-space: nowrap;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.text-red-700 {
  color: #b91c1c;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-700 {
  color: #1d4ed8;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-700 {
  color: #15803d;
}

.bg-orange-100 {
  background-color: #fed7aa;
}

.text-orange-700 {
  color: #c2410c;
}

.bg-purple-100 {
  background-color: #f3e8ff;
}

.text-purple-700 {
  color: #7c2d12;
}

.bg-yellow-100 {
  background-color: #fef3c7;
}

.text-yellow-700 {
  color: #a16207;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.deadline-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.deadline-info i {
  font-size: 14px;
  opacity: 0.7;
}

.assignee-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .task-card {
    padding: 14px;
  }

  .task-title {
    font-size: 13px;
  }

  .task-description {
    font-size: 12px;
  }

  .task-actions {
    opacity: 1;
  }

  .action-btn {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .assignee-avatar {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.task-card {
  animation: cardAppear 0.3s ease-out;
}
</style>