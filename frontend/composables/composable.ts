import { ref, type Ref } from 'vue';
import type { Project, Category, Task } from '~/frontend/types/type';

const projects: Ref<Project[]> = ref([]);
const selectedProject: Ref<Project | null> = ref(null);
const newProjectName: Ref<string> = ref('');
const newCategoryName: Ref<string> = ref('');
const newTask: Ref<{ categoryId: number | null; title: string; description: string }> = ref({ categoryId: null, title: '', description: '' });
const editingTask: Ref<(Task & { categoryId: number }) | null> = ref(null);
const draggedProject: Ref<number | null> = ref(null);
export const useKanban = () => {
    const addProject = () => {
        if (newProjectName.value.trim() !== '') {
            const newProject: Project = { id: Date.now(), name: newProjectName.value, categories: [] };
            projects.value.push(newProject);
            newProjectName.value = '';
        }
    };

    const deleteProject = (projectId: number) => {
        projects.value = projects.value.filter(p => p.id !== projectId);
        if (selectedProject.value?.id === projectId) {
            selectedProject.value = null;
        }
    };

    const updateProject = (projectId: number, newName: string) => {
        const project = projects.value.find(p => p.id === projectId);
        if (project) {
            project.name = newName;
            if (selectedProject.value?.id === projectId) {
                selectedProject.value = { ...project };
            }
        }
    };

    const selectProject = (project: Project) => {
        selectedProject.value = project;
    };

    const addCategory = () => {
        if (selectedProject.value && newCategoryName.value.trim() !== '') {
            const newCategory: Category = { id: Date.now(), name: newCategoryName.value, tasks: [] };
            selectedProject.value.categories.push(newCategory);
            newCategoryName.value = '';
        }
    };

    const addTask = (categoryId: number, title: string, description: string) => {
        if (!selectedProject.value) {
            return;
        }

        const project = selectedProject.value;
        const category = project.categories.find(c => c.id === categoryId);

        if (!category) {
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            description
        };

        category.tasks.push(newTask);
        selectedProject.value = { ...project };
    };


    const updateTask = () => {
        if (!editingTask.value || editingTask.value.title.trim() === '') {
            return;
        }

        const { categoryId, id, title, description } = editingTask.value;

        const category = selectedProject.value?.categories.find(c => c.id === categoryId);
        if (!category) {
            return;
        }

        const taskIndex = category.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
            return;
        }

        category.tasks[taskIndex] = { id, title, description };
        editingTask.value = null;
    };

    const deleteTask = (categoryId: number, taskId: number) => {
        const category = selectedProject.value?.categories.find(c => c.id === categoryId);
        if (category) {
            category.tasks = category.tasks.filter(t => t.id !== taskId);
        }
    };

    const editTask = (categoryId: number, taskId: number) => {
        const category = selectedProject.value?.categories.find(c => c.id === categoryId);
        const task = category?.tasks.find(t => t.id === taskId);
        if (task) {
            editingTask.value = { ...task, categoryId };
        }
    };

    const moveTask = (fromCategoryId: number, toCategoryId: number, taskId: number) => {
        const fromCategory = selectedProject.value?.categories.find(c => c.id === fromCategoryId);
        const toCategory = selectedProject.value?.categories.find(c => c.id === toCategoryId);
        if (fromCategory && toCategory) {
            const taskIndex = fromCategory.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                const [task] = fromCategory.tasks.splice(taskIndex, 1);
                toCategory.tasks.push(task);
            }
        }
    };

    const reorderProjects = (fromIndex: number, toIndex: number) => {
        const [movedProject] = projects.value.splice(fromIndex, 1);
        projects.value.splice(toIndex, 0, movedProject);
    };

    return {
        projects,
        selectedProject,
        newProjectName,
        newCategoryName,
        newTask,
        editingTask,
        draggedProject,
        addProject,
        deleteProject,
        updateProject,
        selectProject,
        addCategory,
        addTask,
        updateTask,
        deleteTask,
        editTask,
        moveTask,
        reorderProjects
    };
};