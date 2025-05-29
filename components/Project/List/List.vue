<template>
  <div class="projects-panel">
    <!-- Background avec effet glassmorphism -->
    <div class="glass-container">
      <!-- Header avec icône -->
      <div class="panel-header">
        <div class="header-icon">
          <i class="ri-folder-line"></i>
        </div>
        <h2 class="panel-title">Mes projets</h2>
      </div>

      <!-- Formulaire d'ajout moderne -->
      <div class="add-project-section">
        <div class="input-container">
          <input
              :value="newProjectName"
              @input="handleInput"
              placeholder="Nouveau projet..."
              class="modern-input"
          />
          <button @click="handleAddProject" class="add-button">
            <i class="ri-add-line"></i>
          </button>
        </div>
      </div>

      <!-- Liste des projets -->
      <div class="projects-list">
        <div
            v-for="(project, index) in projects"
            :key="project.id"
            :class="[
            'project-item',
            { 'selected': selectedProject?.id === project.id },
            { 'dragging': draggedProjectIndex === index }
          ]"
            draggable="true"
            @dragstart="onDragStartProject(index)"
            @dragover="onDragOverProject($event, index)"
            @dragend="onDragEndProject"
            @click="onSelectProject(project)"
        >
          <!-- Indicateur de statut -->
          <div class="status-indicator" :style="{ backgroundColor: getProjectColor(index) }"></div>

          <!-- Contenu du projet -->
          <div class="project-content">
            <div v-if="editingProjectId === project.id" class="edit-mode">
              <input
                  :value="editingProjectName"
                  @input="handleEditInput"
                  @keyup.enter="handleUpdateProject(project.id)"
                  class="edit-input"
                  @click.stop
              />
            </div>
            <div v-else class="project-name">
              {{ project.name }}
            </div>
          </div>

          <!-- Actions et compteur -->
          <div class="project-actions">
            <span class="task-counter">{{ getTaskCount(project) }}</span>
            <button
                v-if="editingProjectId === project.id"
                @click.stop="handleUpdateProject(project.id)"
                class="action-button validate"
            >
              <i class="ri-check-line"></i>
            </button>
            <div @click.stop>
              <Actions
                  @edit="editProject(project)"
                  @delete="openDeleteConfirmation(project)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-section">
        <div class="stats-item">
          <span>Total: {{ projects.length }} projets</span>
        </div>
        <div class="stats-item">
          <span>{{ getTotalTasks() }} tâches</span>
        </div>
      </div>
    </div>

    <!-- Modal de suppression -->
    <DeleteDialog
        :is-open="isDeleteDialogOpen"
        :project-name="projectToDeleteName"
        @update:is-open="isDeleteDialogOpen = $event"
        @confirm="confirmDelete"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { type Project } from '~/types/type';
import { useKanban } from '~/composables/composable';
import { Actions, DeleteDialog } from "~/components/Project";

const { projects, selectedProject, newProjectName, addProject, deleteProject, updateProject, reorderProjects } = useKanban();

const emit = defineEmits<{
  (e: 'projectSelected', project: Project): void
}>();

const editingProjectId = ref<number | null>(null);
const editingProjectName = ref('');
const isDeleteDialogOpen = ref(false);
const projectToDelete = ref<Project | null>(null);
const draggedProjectIndex = ref<number | null>(null);

const projectToDeleteName = computed(() => projectToDelete.value?.name ?? '');

// Couleurs pour les indicateurs de statut
const projectColors = ['#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'];

const handleAddProject = () => {
  addProject();
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  newProjectName.value = target.value;
};

const handleEditInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  editingProjectName.value = target.value;
};

const onSelectProject = (project: Project) => {
  if (editingProjectId.value !== project.id) {
    selectedProject.value = project;
    emit('projectSelected', project);
  }
};

const editProject = (project: Project) => {
  editingProjectId.value = project.id;
  editingProjectName.value = project.name;
};

const handleUpdateProject = (projectId: number) => {
  updateProject(projectId, editingProjectName.value);
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
  if (draggedProjectIndex.value !== null && draggedProjectIndex.value !== index) {
    reorderProjects(draggedProjectIndex.value, index);
    draggedProjectIndex.value = index;
  }
};

const onDragEndProject = () => {
  draggedProjectIndex.value = null;
};

const getProjectColor = (index: number) => {
  return projectColors[index % projectColors.length];
};

const getTaskCount = (project: Project) => {
  return project.categories.reduce((total, category) => total + category.tasks.length, 0);
};

const getTotalTasks = () => {
  return projects.value.reduce((total, project) => total + getTaskCount(project), 0);
};
</script>

<style scoped>
.projects-panel {
  width: 320px;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.glass-container {
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}

.panel-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.add-project-section {
  margin-bottom: 24px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.modern-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px 50px 16px 16px;
  color: white;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.modern-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.02);
}

.add-button {
  position: absolute;
  right: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.projects-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.projects-list::-webkit-scrollbar {
  width: 6px;
}

.projects-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.projects-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.project-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.project-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.project-item.selected {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
  border-left: 3px solid #6366f1;
  transform: translateX(4px);
}

.project-item.dragging {
  opacity: 0.6;
  transform: rotate(5deg) scale(0.95);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.project-content {
  flex: 1;
  min-width: 0;
}

.project-name {
  color: white;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-mode {
  flex: 1;
}

.edit-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.edit-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-counter {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
}

.action-button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.validate {
  background: rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.action-button.validate:hover {
  background: rgba(34, 197, 94, 0.4);
  transform: scale(1.1);
}

.stats-section {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-item {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-item {
  animation: slideIn 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .projects-panel {
    width: 280px;
  }

  .glass-container {
    padding: 16px;
  }

  .panel-title {
    font-size: 20px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>