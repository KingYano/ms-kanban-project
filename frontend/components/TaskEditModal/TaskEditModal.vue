<template>
  <div class="modal" v-if="editingTask">
    <div class="modal-content">
      <h3>Modifier la tâche</h3>
      <input v-model="taskTitle" />
      <textarea v-model="taskDescription"></textarea>
      <button @click="updateTask">Mettre à jour</button>
      <button @click="cancelEdit">Annuler</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useKanban } from '@/composables/composable';
import { computed } from 'vue';

const { editingTask, updateTask } = useKanban();

const taskTitle = computed({
  get: () => editingTask.value?.title ?? '',
  set: (value: string) => {
    if (editingTask.value) editingTask.value.title = value;
  }
});

const taskDescription = computed({
  get: () => editingTask.value?.description ?? '',
  set: (value: string) => {
    if (editingTask.value) editingTask.value.description = value;
  }
});

const cancelEdit = () => {
  editingTask.value = null;
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}
</style>