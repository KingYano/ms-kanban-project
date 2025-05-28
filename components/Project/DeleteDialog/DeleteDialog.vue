<template>
  <AlertDialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cela supprimera définitivement le projet "{{ projectName }}" et toutes ses données associées.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="$emit('update:isOpen', false)">Annuler</AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirm')" class="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '~/components/ui/alert-dialog';

defineProps<{
  isOpen: boolean
  projectName: string
}>();

defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'confirm'): void
}>();
</script>

<style scoped>
.bg-red-600 {
  background-color: #dc2626;
}

.hover\:bg-red-700:hover {
  background-color: #b91c1c;
}
</style>