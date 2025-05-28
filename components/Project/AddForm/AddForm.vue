<template>
  <div class="add-project">
    <input
        :value="newProjectName"
        @input="handleInput"
        placeholder="Nouveau projet"
    />
    <Button @click="$emit('addProject')">Ajouter</Button>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '~/components/ui/button';

defineProps<{
  newProjectName: string
}>();

const emit = defineEmits<{
  (e: 'update:newProjectName', value: string): void
  (e: 'addProject'): void
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:newProjectName', target.value);
};
</script>

<style scoped>
.add-project {
  margin-top: 20px;
  display: flex;
}
</style>