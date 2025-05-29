<template>
  <div class="kanban-board">
    <List @projectSelected="onProjectSelected" />

    <div v-if="selectedProject" class="board-panel">
      <div class="board-header">
        <div class="project-info">
          <div class="project-icon">
            <i class="ri-kanban-view"></i>
          </div>
          <div class="project-details">
            <h1 class="project-title">{{ selectedProject.name }}</h1>
            <div class="project-meta">
              {{ getTotalTasks() }} tâches • {{ selectedProject.categories.length }} catégories • Mis à jour il y a {{ getLastUpdate() }}
            </div>
          </div>
        </div>

        <div class="header-actions">
          <div class="team-avatars">
            <div class="avatar avatar-1"></div>
            <div class="avatar avatar-2"></div>
            <div class="avatar avatar-more">+{{ getTeamCount() }}</div>
          </div>

          <div v-if="!isAddingCategory" class="add-category-section">
            <button @click="startAddingCategory" class="add-category-btn">
              <i class="ri-add-line"></i>
              Nouvelle catégorie
            </button>
          </div>
          <div v-else class="add-category-form">
            <input
                v-model="newCategoryName"
                placeholder="Nom de la catégorie..."
                class="category-input"
                @keyup.enter="handleAddCategory"
            />
            <button @click="handleAddCategory" class="validate-btn">
              <i class="ri-check-line"></i>
            </button>
            <button @click="cancelAddCategory" class="cancel-btn">
              <i class="ri-close-line"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="board-content">
        <div class="categories-container">
          <CategoryColumn
              v-for="(category, index) in selectedProject.categories"
              :key="category.id"
              :category="category"
              :categoryIndex="index"
              @dragover.prevent
              @drop="onDrop($event, category.id)"
          />

          <div v-if="selectedProject.categories.length === 0" class="empty-board">
            <div class="empty-icon">
              <i class="ri-kanban-view"></i>
            </div>
            <h3>Aucune catégorie</h3>
            <p>Commencez par créer votre première catégorie pour organiser vos tâches</p>
            <button @click="startAddingCategory" class="empty-add-btn">
              <i class="ri-add-line"></i>
              Créer une catégorie
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-content">
        <div class="empty-illustration">
          <i class="ri-kanban-view"></i>
        </div>
        <h2>Bienvenue dans votre espace Kanban</h2>
        <p>Sélectionnez un projet existant ou créez-en un nouveau pour commencer à organiser vos tâches</p>
        <div class="empty-actions">
          <button class="create-project-btn">
            <i class="ri-add-line"></i>
            Créer mon premier projet
          </button>
        </div>
      </div>
    </div>

    <TaskEditModal v-if="editingTask" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useKanban } from '~/composables/composable';
import CategoryColumn from '~/components/CategoryColumn/CategoryColumn.vue';
import TaskEditModal from '~/components/TaskEditModal/TaskEditModal.vue';
import { type Project } from '~/types/type';
import { List } from "~/components/Project";

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

const handleAddCategory = () => {
  if (newCategoryName.value.trim()) {
    addCategory();
    isAddingCategory.value = false;
  }
};

const cancelAddCategory = () => {
  isAddingCategory.value = false;
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

const getTotalTasks = () => {
  if (!selectedProject.value) return 0;
  return selectedProject.value.categories.reduce((total, category) => total + category.tasks.length, 0);
};

const getLastUpdate = () => {
  const updates = ['2h', '1j', '3h', '5min', '1h'];
  return updates[Math.floor(Math.random() * updates.length)];
};

const getTeamCount = () => {
  return Math.floor(Math.random() * 8) + 1;
};
</script>

<style scoped>
.kanban-board {
  display: flex;
  height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.board-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.board-header {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-info {
  display: flex;
  align-items: center;
}

.project-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  font-size: 24px;
  color: white;
}

.project-details {
  flex: 1;
}

.project-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.project-meta {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.team-avatars {
  display: flex;
  align-items: center;
  gap: -8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-left: -8px;
}

.avatar-1 {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.avatar-2 {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
}

.avatar-more {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.add-category-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.add-category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
}

.add-category-form {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.category-input {
  padding: 8px 12px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
  background: white;
  color: #1e293b;
}

.category-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.validate-btn {
  background: #10b981;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.validate-btn:hover {
  background: #059669;
  transform: scale(1.1);
}

.cancel-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.board-content {
  flex: 1;
  overflow: hidden;
  padding: 32px;
}

.categories-container {
  display: flex;
  gap: 24px;
  height: 100%;
  overflow-x: auto;
  padding-bottom: 16px;
}

.categories-container::-webkit-scrollbar {
  height: 8px;
}

.categories-container::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 4px;
}

.categories-container::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

.categories-container::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.empty-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #64748b;
  min-width: 400px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 24px;
  color: #94a3b8;
}

.empty-board h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #475569;
}

.empty-board p {
  font-size: 16px;
  margin: 0 0 32px 0;
  max-width: 320px;
  line-height: 1.6;
}

.empty-add-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.empty-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.empty-content {
  text-align: center;
  max-width: 480px;
  padding: 48px;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 auto 32px;
  color: #94a3b8;
}

.empty-content h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.empty-content p {
  font-size: 18px;
  color: #64748b;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.create-project-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.create-project-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
}

@media (max-width: 1024px) {
  .board-header {
    padding: 16px 24px;
    flex-direction: column;
    gap: 16px;
  }

  .project-title {
    font-size: 24px;
  }

  .project-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .board-content {
    padding: 16px;
  }

  .categories-container {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .kanban-board {
    flex-direction: column;
  }

  .empty-content {
    padding: 24px;
  }

  .empty-content h2 {
    font-size: 24px;
  }

  .empty-illustration {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
}
</style>