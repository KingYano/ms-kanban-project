<template>
  <div v-if="editingTask" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="modal-icon">
            <i class="ri-edit-line"></i>
          </div>
          <div class="header-text">
            <h2 class="modal-title">Modifier la tâche</h2>
            <p class="modal-subtitle">Mettez à jour les détails de votre tâche</p>
          </div>
        </div>
        <button @click="cancelEdit" class="close-button">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-section">
          <label class="form-label">
            <i class="ri-text"></i>
            Titre de la tâche
          </label>
          <input
              v-model="taskTitle"
              class="form-input title-input"
              placeholder="Entrez le titre de la tâche..."
              @keyup.enter="focusDescription"
              ref="titleInput"
          />
        </div>

        <div class="form-section">
          <label class="form-label">
            <i class="ri-file-text-line"></i>
            Description
          </label>
          <textarea
              v-model="taskDescription"
              class="form-textarea"
              placeholder="Décrivez les détails de la tâche..."
              rows="4"
              ref="descriptionInput"
          ></textarea>
        </div>

        <div class="form-grid">
          <div class="form-section">
            <label class="form-label">
              <i class="ri-flag-line"></i>
              Priorité
            </label>
            <select v-model="taskPriority" class="form-select">
              <option value="low">🟢 Basse</option>
              <option value="medium">🟡 Moyenne</option>
              <option value="high">🔴 Haute</option>
            </select>
          </div>

          <div class="form-section">
            <label class="form-label">
              <i class="ri-calendar-line"></i>
              Échéance
            </label>
            <input
                v-model="taskDeadline"
                type="date"
                class="form-input"
            />
          </div>
        </div>

        <div class="form-section">
          <label class="form-label">
            <i class="ri-price-tag-3-line"></i>
            Tags
          </label>
          <div class="tags-container">
            <div class="selected-tags">
              <span
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="selected-tag"
              >
                {{ tag }}
                <button @click="removeTag(tag)" class="remove-tag-btn">
                  <i class="ri-close-line"></i>
                </button>
              </span>
            </div>
            <input
                v-model="newTag"
                @keyup.enter="addTag"
                @keyup.space="addTag"
                class="tag-input"
                placeholder="Ajouter un tag..."
            />
          </div>
          <div class="suggested-tags">
            <button
                v-for="tag in suggestedTags"
                :key="tag"
                @click="selectSuggestedTag(tag)"
                class="suggested-tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="footer-info">
          <i class="ri-information-line"></i>
          <span>Utilisez Entrée pour sauvegarder rapidement</span>
        </div>
        <div class="footer-actions">
          <button @click="cancelEdit" class="cancel-button">
            <i class="ri-close-line"></i>
            Annuler
          </button>
          <button @click="updateTask" class="save-button" :disabled="!taskTitle.trim()">
            <i class="ri-check-line"></i>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useKanban } from '~/composables/composable';
import { computed, ref, nextTick, onMounted } from 'vue';

const { editingTask, updateTask } = useKanban();

const titleInput = ref<HTMLInputElement>();
const descriptionInput = ref<HTMLTextAreaElement>();
const newTag = ref('');
const selectedTags = ref<string[]>(['Design', 'Frontend']);
const taskPriority = ref('medium');
const taskDeadline = ref('');

const suggestedTags = ['Backend', 'API', 'UI/UX', 'Bug', 'Feature', 'Urgent', 'Review', 'Testing'];

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

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    cancelEdit();
  }
};

const focusDescription = () => {
  nextTick(() => {
    descriptionInput.value?.focus();
  });
};

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
    newTag.value = '';
  }
};

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
};

const selectSuggestedTag = (tag: string) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
};

onMounted(() => {
  nextTick(() => {
    titleInput.value?.focus();
  });
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  padding: 24px 32px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.header-text {
  flex: 1;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.close-button {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-body {
  padding: 32px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.form-section {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-label i {
  font-size: 16px;
  color: #6366f1;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 16px;
  color: #374151;
  background: #fafafa;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.title-input {
  font-weight: 600;
  font-size: 18px;
}

.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
  background: #fafafa;
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-select {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.tags-container {
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.tags-container:focus-within {
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.selected-tag {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-tag-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.tag-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #374151;
  width: 100%;
  padding: 4px 0;
}

.tag-input:focus {
  outline: none;
}

.suggested-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.suggested-tag {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggested-tag:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.modal-footer {
  background: rgba(248, 250, 252, 0.8);
  padding: 24px 32px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
}

.footer-info i {
  color: #6366f1;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.cancel-button {
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
  border: 2px solid rgba(148, 163, 184, 0.2);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background: rgba(148, 163, 184, 0.15);
  border-color: rgba(148, 163, 184, 0.3);
}

.save-button {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.save-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .modal-body {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .modal-footer {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
  }

  .footer-actions {
    width: 100%;
    justify-content: stretch;
  }

  .cancel-button,
  .save-button {
    flex: 1;
    justify-content: center;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>