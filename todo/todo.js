// Global variables
let tasks = [];
let taskIdCounter = 0;
let currentFilter = 'all';
let currentSort = 'none';

// Level 1 Bug 1: Missing initialization function call
window.onload = function() {
    updateCounts();
    renderTasks();
};

function addTask() {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const dueDateInput = document.getElementById('due-date');
    const dueTimeInput = document.getElementById('due-time');
    
    const taskText = taskInput.value.trim();
    
    if (!taskText) {
        alert('Please enter a task!');
        return;
    }
    
    // Level 2 Bug 1: Task ID collision possible
    const newTask = {
        id: Date.now(), // Fixed: Use timestamp for unique IDs
        text: taskText,
        completed: false,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value,
        dueTime: dueTimeInput.value,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    // Clear inputs
    taskInput.value = '';
    dueDateInput.value = '';
    dueTimeInput.value = '';
    
    renderTasks();
    updateCounts();
}

document.getElementById('task-input').addEventListener('keypress', function(e) {
    // Level 1 Bug 2: Enter key doesn't work for adding tasks
    if (e.key === 'Enter') {
        addTask();
    }
});

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `p-4 border rounded-lg ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`;
    
    let priorityColor = 'gray';
    if (task.priority === 'low') priorityColor = 'green';
    else if (task.priority === 'medium') priorityColor = 'yellow';
    else if (task.priority === 'high') priorityColor = 'red';
    
    let dueDateText = '';
    if (task.dueDate) {
        const date = new Date(task.dueDate + 'T' + task.dueTime);
        if (!isNaN(date)) {
            dueDateText = date.toLocaleDateString();
        } else {
            dueDateText = 'Invalid Date';
        }
    }
    
    taskDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})" 
                       class="w-5 h-5 text-indigo-600">
                <div class="flex-1">
                    <div class="${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} font-medium">
                        ${task.text}
                    </div>
                    <div class="text-sm text-${priorityColor}-600">
                        Priority: ${task.priority} ${dueDateText ? '| Due: ' + dueDateText : ''}
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editTask(${task.id})" class="text-blue-500 hover:text-blue-700 text-sm">
                    Edit
                </button>
                <button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700 text-sm">
                    Delete
                </button>
            </div>
        </div>
    `;
    
    return taskDiv;
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateCounts();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim()) {
            task.text = newText.trim();
            renderTasks();
        }
    }
}

function deleteTask(id) {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (confirmed) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateCounts();
    }
}

function filterTasks(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === currentFilter);
    });
    
    renderTasks();
}

function sortTasks(sortBy) {
    currentSort = sortBy;
    
    if (sortBy === 'priority') {
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 }; // Fixed correct order
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'date') {
        tasks.sort((a, b) => {
            const dateA = new Date(a.dueDate || '9999-12-31');
            const dateB = new Date(b.dueDate || '9999-12-31');
            return dateA - dateB;
        });
    }
    
    renderTasks();
}

function updateCounts() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    document.getElementById('count-all').textContent = totalTasks;
    document.getElementById('count-pending').textContent = pendingTasks;
    document.getElementById('count-completed').textContent = completedTasks;
}

function markAllComplete() {
    tasks.forEach(task => {
        task.completed = true;
    });
    renderTasks();
    updateCounts();
}

function deleteCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    updateCounts();
}

function clearAllTasks() {
    const confirmed = confirm('Are you sure you want to clear all tasks?');
    if (confirmed) {
        tasks = [];
        renderTasks();
        updateCounts();
    }
}
