import { updateTask, addTask } from './taskManager';

export const handleTaskFormSubmit = async (event: Event) => {
    event.preventDefault();

    const titleInput = document.querySelector<HTMLInputElement>('input[name="title"]');
    const descriptionInput = document.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
    const dueDateInput = document.querySelector<HTMLInputElement>('input[name="due_date"]');
    const dueTimeInput = document.querySelector<HTMLInputElement>('input[name="due_time"]');

    if (!titleInput || !descriptionInput || !dueDateInput || !dueTimeInput) {
        console.error('Los campos del formulario no están disponibles.');
        return;
    }

    if (!titleInput.value || !descriptionInput.value || !dueDateInput.value || !dueTimeInput.value) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Combinar la fecha y la hora tal como el usuario las ingresa
    const dueDateString = dueDateInput.value; // Fecha en formato YYYY-MM-DD
    const dueTimeString = dueTimeInput.value; // Hora en formato HH:mm

    // Crear un objeto Date en la zona horaria local
    const combinedDateTime = new Date(`${dueDateString}T${dueTimeString}:00`);

    if (isNaN(combinedDateTime.getTime())) {
        alert('La fecha y hora son inválidas.');
        return;
    }

    // Enviar la fecha en formato ISO al servidor sin convertir manualmente a UTC
    const taskData = {
        title: titleInput.value,
        description: descriptionInput.value,
        due_date: combinedDateTime.toISOString(),  // Convertir a formato ISO estándar
        completed: false,
    };

    try {
        if (typeof window.currentTaskId === 'number') {
            await updateTask(window.currentTaskId, taskData);
            alert('Tarea actualizada');
            window.currentTaskId = null;

            const submitButton = document.querySelector<HTMLButtonElement>('button[type="submit"]');
            if (submitButton) {
                submitButton.innerText = 'Agregar Tarea';
            }

        } else {
            await addTask(taskData);
            alert('Tarea agregada');
        }

        // Limpiar el formulario después de enviar
        titleInput.value = '';
        descriptionInput.value = '';
        dueDateInput.value = '';
        dueTimeInput.value = '';

        const { fetchTasksAndRender } = await import('./main');
        fetchTasksAndRender();
    } catch (error) {
        console.error('Error al agregar o actualizar la tarea:', error);
        alert('Hubo un error al procesar la tarea.');
    }
};
