<template>
  <div class="projects-panel">
    <h2>Mes projets :</h2>
    <div class="add-project">
      <input v-model="newProjectName" placeholder="Nouveau projet" />
      <Button @click="addProject" >Ajouter</Button>
    </div>
    <div
        v-for="(project, index) in projects"
        :key="project.id"
        draggable
        @dragstart="onDragStartProject($event, index)"
        @dragover="onDragOverProject($event, index)"
        @dragend="onDragEndProject"
        :class="{ 'selected': selectedProject?.id === project.id }"
        @click="onSelectProject(project)"
    >
      {{ project.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Project } from '@/frontend/types/type';
import { useKanban } from '@/frontend/composables/composable';

import { Button } from '@/components/ui/button'


const { projects, selectedProject, newProjectName, addProject } = useKanban();

const emit = defineEmits(['projectSelected']);

const onSelectProject = (project: Project) => {
  selectedProject.value = project;
  emit('projectSelected', project);
};

const onDragStartProject = (e: DragEvent, index: number) => {
  // Implémentez la logique de drag start
};

const onDragOverProject = (e: DragEvent, index: number) => {
  // Implémentez la logique de drag over
};

const onDragEndProject = () => {
  // Implémentez la logique de drag end
};
</script>

<style scoped>
.projects-panel {
  width: 250px;
  padding: 20px;
  background-color: #D3D3D3;
}

.projects-panel > div {
  margin-bottom: 10px;
  cursor: move;
  padding: 5px;
}

.projects-panel > div.selected {
  background-color: #B0B0B0;
}

.add-project {
  margin-top: 20px;
  display: flex;
}
</style>