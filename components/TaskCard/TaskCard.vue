<template>
  <div
      class="task"
      draggable
      @dragstart="onDragStart($event, categoryId, task.id)"
  >
    <div class="task-header">
      <strong>{{ task.title }}</strong>
      <div>
        <button @click="editTask(categoryId, task.id)">✏️</button>
        <button @click="deleteTask(categoryId, task.id)">🗑️</button>
      </div>
    </div>
    <p>{{ task.description }}</p>
  </div>
</template>

<script lang="ts" setup>
import {type PropType } from 'vue';
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
  }
});

const { editTask, deleteTask } = useKanban();

const onDragStart = (e: DragEvent, categoryId: number, taskId: number) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ categoryId, taskId }));
  }
};
</script>

<style scoped>
.task {
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: move;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>