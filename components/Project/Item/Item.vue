<template>
  <div
      :class="{ 'selected': isSelected, 'dragging': isDragging }"
      draggable="true"
      @dragstart="onDragStart"
      @dragover.prevent
      @dragenter.prevent
      @dragleave="onDragLeave"
      @drop="onDrop"
      @dragend="onDragEnd"
      @click="$emit('select', project)"
  >
    <div v-if="isEditing" class="edit-project-name">
      <input
          :value="editingName"
          @input="handleInput"
          @keyup.enter="$emit('update', project.id, editingName)"
      />
    </div>
    <div v-else>{{ project.name }}</div>
    <Button
        v-if="isEditing"
        @click="$emit('update', project.id, editingName)"
        variant="ghost"
        size="icon"
        class="validate-button"
    >
      <i class="ri-check-line"></i>
    </Button>
    <Actions
        v-else
        @edit="$emit('edit', project)"
        @delete="$emit('delete', project)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from '~/components/ui/button';
import { type Project } from '~/types/type';
import { Actions } from "~/components/Project";

const props = defineProps<{
  project: Project
  isSelected: boolean
  isEditing: boolean
  editingName: string
}>();

const emit = defineEmits<{
  (e: 'select', project: Project): void
  (e: 'edit', project: Project): void
  (e: 'update', id: number, name: string): void
  (e: 'delete', project: Project): void
  (e: 'update:editingName', value: string): void
  (e: 'dragStart', event: DragEvent): void
  (e: 'dragOver', event: DragEvent): void
  (e: 'dragEnd'): void
}>();

const isDragging = ref(false);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:editingName', target.value);
};

const onDragStart = (event: DragEvent) => {
  isDragging.value = true;
  emit('dragStart', event);
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  emit('dragOver', event);
};

const onDragEnd = () => {
  isDragging.value = false;
  emit('dragEnd');
};
</script>

<style scoped>
div {
  margin-bottom: 10px;
  cursor: move;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

div.selected {
  background-color: #B0B0B0;
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

.dragging {
  opacity: 0.5;
}
</style>