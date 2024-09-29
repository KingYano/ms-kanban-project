<template>
  <div class="projects-panel">
    <h2>Mes projets :</h2>
    <div class="add-project">
      <input v-model="newProjectName" placeholder="Nouveau projet" />
      <Button @click="addProject">Ajouter</Button>
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
      <div v-if="editingProjectId === project.id" class="edit-project-name">
        <input
            v-model="editingProjectName"
            @keyup.enter="handleUpdateProject(project.id)"
        />
      </div>
      <div v-else>{{ project.name }}</div>
      <Button
          v-if="editingProjectId === project.id"
          @click="handleUpdateProject(project.id)"
          variant="ghost"
          size="icon"
          class="validate-button"
      >
        <i class="ri-check-line"></i>
      </Button>
      <DropdownMenu v-else>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <i class="ri-more-2-line"></i>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-40">
          <DropdownMenuItem @click="editProject(project)" class="dropdown-button edit-button">
            <i class="ri-edit-line mr-2"></i> Modifier
          </DropdownMenuItem>
          <DropdownMenuItem @click="openDeleteConfirmation(project)" class="dropdown-button delete-button">
            <i class="ri-delete-bin-line mr-2"></i> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>

  <AlertDialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cela supprimera définitivement le projet "{{ projectToDeleteName }}" et toutes ses données associées.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="isDeleteDialogOpen = false">Annuler</AlertDialogCancel>
        <AlertDialogAction @click="confirmDelete" class="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { type Project } from '@/frontend/types/type';
import { useKanban } from '@/frontend/composables/composable';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

const { projects, selectedProject, newProjectName, addProject, deleteProject, updateProject } = useKanban();

const emit = defineEmits(['projectSelected']);

const editingProjectId = ref<number | null>(null);
const editingProjectName = ref('');
const isDeleteDialogOpen = ref(false);
const projectToDelete = ref<Project | null>(null);

const projectToDeleteName = computed(() => projectToDelete.value?.name ?? '');

const onSelectProject = (project: Project) => {
  selectedProject.value = project;
  emit('projectSelected', project);
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.projects-panel > div.selected {
  background-color: #B0B0B0;
}

.add-project {
  margin-top: 20px;
  display: flex;
}

.edit-project-name {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.edit-project-name input {
  flex-grow: 1;
  margin-right: 5px;
  padding: 2px 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.validate-button {
  color: #4a90e2;
}

.dropdown-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-button:hover {
  background-color: #f0f0f0;
}

.dropdown-button.edit-button {
  color: #4a90e2;
}

.dropdown-button.delete-button {
  color: #e25555;
}

:global(.dark) .dropdown-button:hover {
  background-color: #2a2a2a;
}

.bg-red-600 {
  background-color: #dc2626;
}

.hover\:bg-red-700:hover {
  background-color: #b91c1c;
}
</style>