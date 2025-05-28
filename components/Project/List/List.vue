<template>
  <div class="projects-panel">
    <h2>Mes projets :</h2>
    <AddForm
        :new-project-name="newProjectName"
        @update:new-project-name="newProjectName = $event"
        @add-project="addProject"
    />
    <Item
        v-for="(project, index) in projects"
        :key="project.id"
        :project="project"
        :is-selected="selectedProject?.id === project.id"
        :is-editing="editingProjectId === project.id"
        :editing-name="editingProjectName"
        @update:editing-name="editingProjectName = $event"
        @select="onSelectProject"
        @edit="editProject"
        @update="handleUpdateProject"
        @delete="openDeleteConfirmation"
        @drag-start="onDragStartProject(index)"
        @drag-over="onDragOverProject($event, index)"
        @drag-end="onDragEndProject"
    />
  </div>
  <DeleteDialog
      :is-open="isDeleteDialogOpen"
      :project-name="projectToDeleteName"
      @update:is-open="isDeleteDialogOpen = $event"
      @confirm="confirmDelete"
  />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { type Project } from '~/types/type';
import { useKanban } from '~/composables/composable';
import {AddForm, DeleteDialog, Item} from "~/components/Project";

const { projects, selectedProject, newProjectName, addProject, deleteProject, updateProject, reorderProjects } = useKanban();

const emit = defineEmits(['projectSelected']);

const editingProjectId = ref<number | null>(null);
const editingProjectName = ref('');
const isDeleteDialogOpen = ref(false);
const projectToDelete = ref<Project | null>(null);
const draggedProjectIndex = ref<number | null>(null);

const projectToDeleteName = computed(() => projectToDelete.value?.name ?? '');

const onSelectProject = (project: Project) => {
  selectedProject.value = project;
  emit('projectSelected', project);
};

const editProject = (project: Project) => {
  editingProjectId.value = project.id;
  editingProjectName.value = project.name;
};

const handleUpdateProject = (projectId: number, newName: string) => {
  updateProject(projectId, newName);
  editingProjectId.value = null;
};

const openDeleteConfirmation = (project: Project) => {
  projectToDelete.value = project;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = () => {
  if (projectToDelete.value) {
    deleteProject(projectToDelete.value.id);
    isDeleteDialogOpen.value = false;
    projectToDelete.value = null;
  }
};

const onDragStartProject = (index: number) => {
  draggedProjectIndex.value = index;
};

const onDragOverProject = (e: DragEvent, index: number) => {
  e.preventDefault();
  const draggedOverItem = projects.value[index];
  if (draggedProjectIndex.value !== null && draggedProjectIndex.value !== index) {
    reorderProjects(draggedProjectIndex.value, index);
    draggedProjectIndex.value = index;
  }
};

const onDragEndProject = () => {
  draggedProjectIndex.value = null;
};
</script>

<style scoped>
.projects-panel {
  width: 250px;
  padding: 20px;
  background-color: #D3D3D3;
}
</style>