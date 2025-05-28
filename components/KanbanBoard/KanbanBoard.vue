<template>
  <div class="kanban-board">
    <List @projectSelected="onProjectSelected" />
    <div v-if="selectedProject" class="board-panel">
      <div class="board-header">
        <h2>{{ selectedProject.name }}</h2>
        <div v-if="!isAddingCategory">
          <button @click="startAddingCategory">Ajouter une catégorie</button>
        </div>
        <div v-else class="add-category">
          <input v-model="newCategoryName" placeholder="Nom de la catégorie" />
          <button @click="addCategory">Valider</button>
        </div>
      </div>
      <div class="categories">
        <CategoryColumn
            v-for="category in selectedProject.categories"
            :key="category.id"
            :category="category"
            @dragover.prevent
            @drop="onDrop($event, category.id)"
        />
      </div>
    </div>
    <div v-else class="empty-state">
      <p>Sélectionnez ou créez un projet pour commencer</p>
    </div>
    <TaskEditModal v-if="editingTask" />
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue';
import { useKanban } from '~/composables/composable';
import CategoryColumn from '~/components/CategoryColumn/CategoryColumn.vue';
import TaskEditModal from '~/components/TaskEditModal/TaskEditModal.vue';
import { type Project } from '~/types/type';
import {List} from "~/components/Project";

const {
  selectedProject,
  newCategoryName,
  editingTask,
  addCategory
} = useKanban();

const isAddingCategory = ref(false);

const startAddingCategory = () => {
  isAddingCategory.value = true;
  newCategoryName.value = '';
};

const onProjectSelected = (project: Project) => {
  selectedProject.value = { ...project };
};

const onDrop = (e: DragEvent, categoryId: number) => {
  const data = e.dataTransfer?.getData('text');
  if (data) {
    const { sourceCategory, taskId } = JSON.parse(data);
    if (sourceCategory !== categoryId && selectedProject.value) {
      const sourceCat = selectedProject.value.categories.find(c => c.id === sourceCategory);
      const destCat = selectedProject.value.categories.find(c => c.id === categoryId);
      if (sourceCat && destCat) {
        const taskIndex = sourceCat.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          const [task] = sourceCat.tasks.splice(taskIndex, 1);
          destCat.tasks.push(task);
        }
      }
    }
  }
};
</script>

<style>
.kanban-board {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.board-panel {
  flex: 1;
  padding: 20px;
  background-color: #F0F0F0;
  overflow-x: auto;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.categories {
  display: flex;
  gap: 20px;
}
</style>