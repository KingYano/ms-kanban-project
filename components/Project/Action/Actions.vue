<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <i class="ri-more-2-line"></i>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-40">
      <DropdownMenuItem @click="$emit('edit')" class="dropdown-button edit-button">
        <i class="ri-edit-line mr-2"></i> Modifier
      </DropdownMenuItem>
      <DropdownMenuItem @click="$emit('delete')" class="dropdown-button delete-button">
        <i class="ri-delete-bin-line mr-2"></i> Supprimer
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>();
</script>

<style scoped>
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
</style>