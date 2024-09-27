<template>
  <div
      v-if="category"
      class="category"
      @dragover="onDragOver"
      @drop="onDrop($event, category.id)"
  >
    <h3>{{ category.name }} ({{ categoryTasks.length }})</h3>
    <TaskCard
        v-for="task in categoryTasks"
        :key="task.id"
        :task="task"
        :categoryId="category.id"
    />
    <div v-if="isAddingTask" class="new-task">
      <input v-model="newTaskLocal.title" placeholder="Titre de la tâche" />
      <textarea v-model="newTaskLocal.description" placeholder="Description de la tâche"></textarea>
      <button @click="handleAddTask">Valider</button>
    </div>
    <button @click="startAddingTask">+ Ajouter une tâche</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType, computed } from 'vue';
import { Category, Task } from '@/types/type';
import { useKanban } from '@/composables/composable';
import TaskCard from '@/components/TaskCard/TaskCard.vue';

const props = defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true
  }
});

const { addTask, selectedProject } = useKanban();

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

const startAddingTask = () => {
  if (category.value) {
    isAddingTask.value = true;
    newTaskLocal.value = { categoryId: category.value.id, title: '', description: '' };
  }
};

const handleAddTask = () => {
  if (newTaskLocal.value.categoryId !== null) {
    addTask(newTaskLocal.value.categoryId, newTaskLocal.value.title, newTaskLocal.value.description);
    isAddingTask.value = false;
    newTaskLocal.value = { categoryId: category.value?.id ?? null, title: '', description: '' };
  }
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const onDrop = (e: DragEvent, categoryId: number) => {
  // Implémentez la logique de drop
};
</script>

<style scoped>
.category {
  flex: 0 0 300px;
  background-color: #E0E0E0;
  padding: 10px;
  border-radius: 5px;
}

.new-task {
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.new-task input,
.new-task textarea {
  width: 100%;
  margin-bottom: 5px;
}
</style>