// Función para obtener tareas
export const fetchTasks = async () => {
    try {
        const response = await fetch('http://localhost:8000/tasks/');
        if (!response.ok) {
            throw new Error('Error al obtener las tareas');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        return [];
    }
};

// Función para agregar tarea
export const addTask = async (taskData) => {
    try {
        const response = await fetch('http://localhost:8000/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) {
            throw new Error('Error al agregar la tarea');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
    }
};

// Función para actualizar tarea
export const updateTask = async (taskId: number, taskData) => {
    try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la tarea');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
    }
};

// Función para editar una tarea
export const editTask = async (taskId: number) => {
    window.currentTaskId = taskId; // Establece el ID de la tarea actual para editar

    try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error('Error al obtener la tarea');
        }
        const task = await response.json();

        const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
        const descriptionInput = document.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
        const dueDateInput = document.querySelector<HTMLInputElement>('input[name="due_date"]');
        const dueTimeInput = document.querySelector<HTMLInputElement>('input[name="due_time"]');

        if (titleInput && descriptionInput && dueDateInput && dueTimeInput) {
            titleInput.value = task.title;
            descriptionInput.value = task.description;

            // Rellena la fecha y hora en la zona horaria local
            const dueDateTime = new Date(task.due_date);
            dueDateInput.value = dueDateTime.toISOString().split('T')[0];
            dueTimeInput.value = dueDateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }

        const submitButton = document.querySelector<HTMLButtonElement>('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Actualizar';
        }

    } catch (error) {
        console.error('Error al editar la tarea:', error);
    }
};

// Función para eliminar tarea
export const deleteTask = async (taskId: number) => {
    try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}/`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la tarea');
        }
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
    }
};
