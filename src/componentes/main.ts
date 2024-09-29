import { handleTaskFormSubmit } from './formHandler';
import { fetchTasks, editTask, deleteTask } from './taskManager';

declare global {
    interface Window {
        editTask: (taskId: number) => void;
        deleteTask: (taskId: number) => void;
        currentTaskId: number | null;
    }
}

window.currentTaskId = null;

const createCell = (content: string): HTMLTableCellElement => {
    const cell = document.createElement('td');
    cell.innerText = content;
    return cell;
};

const renderTaskList = (tasks) => {
    const taskListDiv = document.getElementById('taskList');
    if (!taskListDiv) {
        console.error('El elemento taskList no se encontró en el DOM.');
        return;
    }

    taskListDiv.innerHTML = '';
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.appendChild(createCell(task.title));
        row.appendChild(createCell(task.description));

        const dueDateTime = new Date(task.due_date);  // Fecha en UTC

        if (isNaN(dueDateTime.getTime())) {
            row.appendChild(createCell('Fecha no válida'));
            row.appendChild(createCell('Hora no válida'));
        } else {
            // Convertir la fecha UTC a la zona horaria local del navegador
            const localDateTime = new Date(dueDateTime.getTime());
            const formattedDate = localDateTime.toLocaleDateString('es-ES');
            const formattedTime = localDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

            row.appendChild(createCell(formattedDate));
            row.appendChild(createCell(formattedTime));
        }

        const actionsCell = createCell('');

        const editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.onclick = () => editTask(task.id);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Eliminar';
        deleteButton.onclick = async () => {
            const confirmDelete = confirm('¿Está seguro que desea eliminar esta tarea?');
            if (confirmDelete) {
                await deleteTask(task.id);
                alert('Tarea eliminada');
                fetchTasksAndRender();
            }
        };
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        taskListDiv.appendChild(row);
    });
};


export const fetchTasksAndRender = async () => {
    const tasks = await fetchTasks();
    renderTaskList(tasks);
};

let tasksVisible = true;

const toggleTasksButton = document.getElementById('toggleTasksButton');
const taskListDiv = document.getElementById('taskList');

if (toggleTasksButton && taskListDiv) {
    toggleTasksButton.innerText = 'Ocultar Tareas';

    toggleTasksButton.addEventListener('click', async () => {
        if (tasksVisible) {
            taskListDiv.style.display = 'none';
            toggleTasksButton.innerText = 'Ver Tareas';
        } else {
            taskListDiv.style.display = 'table-row-group';
            await fetchTasksAndRender();
            toggleTasksButton.innerText = 'Ocultar Tareas';
        }
        tasksVisible = !tasksVisible;
    });
}

const taskForm = document.getElementById('taskForm');
if (taskForm) {
    taskForm.addEventListener('submit', handleTaskFormSubmit);
}

fetchTasksAndRender();
