let tasks = [];
function outputTask(task) {
    const list = document.getElementById('list');
    let taskElement = document.createElement('div')
    taskElement.className = "task";
    list.appendChild(taskElement)

    let taskId = document.createElement('p')
    taskId.className = "id"
    taskId.textContent = task.id
    taskElement.appendChild(taskId)

    let taskName = document.createElement('p')
    if (task.done) {
        taskElement.style = "color:gray;text-decoration: line-through; opacity:0.7"
    } else {
        taskElement.style = "color:black;text-decoration:none;"
    }
    taskName.textContent = task.name;
    taskElement.appendChild(taskName)

    if (task.description) {
        let taskDescription = document.createElement('p')
        taskDescription.textContent = task.description;
        taskElement.appendChild(taskDescription)
    }

    let taskDate;
    if (task.due_date) {
        taskDate = document.createElement('p')
        let due_date = new Date(task.due_date);
        let optionsTaskDate = { year: 'numeric', month: 'long', day: '2-digit' };
        let date = Intl.DateTimeFormat('en-US', optionsTaskDate).format(due_date)
        if (overdue(task)) {
            taskDate.className = "overdue";
            taskDate.textContent = date;

        } else {
            taskDate.className = "";
            taskDate.textContent = date;
        }

        taskElement.appendChild(taskDate);
    }
    let taskStatus = document.createElement('input');
    taskStatus.className = "check";
    taskStatus.type = "checkbox";
    taskStatus.checked = task.done;
    taskStatus.onclick = () => updateStatus(taskStatus, taskElement, taskId, taskDate);
    taskElement.appendChild(taskStatus);

    let taskRemove = document.createElement('button');
    taskRemove.className = "remove";
    taskRemove.textContent = "X";
    taskRemove.onclick = () => {
        removeTask(taskElement, taskId)
    }
    taskElement.appendChild(taskRemove);
}

function overdue(task) {
    let overdue;
    let date = new Date()
    let due_date = new Date(task.due_date)
    let options = { year: 'numeric', month: 'numeric', day: '2-digit' };
    let today = Intl.DateTimeFormat('en-US', options).format(date);
    today = new Date(`${today}`);
    if (due_date < today && task.done == false) {
        overdue = true
    } else {
        overdue = false
    }
    return overdue
}

let allTasks = document.getElementById('all')
function outputAllTasks(tasks) {
    allTasks.style = "background-color:coral";
    tasks.forEach(outputTask);
}

function updateStatus(taskStatus, taskForm, taskId, taskDate) {
    let id = taskId.textContent;
    let done = taskStatus.checked
    updateStatusInDb(id, done)
        .then(() => {
            const task = tasks.find(t => t.id == id);
            if (taskStatus.checked) {
                taskForm.style = "color:gray;text-decoration: line-through; opacity:0.7"
                task.done = true;
                taskDate ? overdue(task) ? taskDate.className = "overdue" : taskDate.className = "" : '';
            } else {
                taskForm.style = "color:black;text-decoration:none;"
                task.done = false
                taskDate ? overdue(task) ? taskDate.className = "overdue" : taskDate.className = "" : '';
            }
        })
}

function removeTask(taskForm, taskId) {
    removeTaskFromDb(taskId)
        .then(() => {
            let id = taskId.textContent;
            const indexTask = tasks.findIndex(task => task.id == id);
            tasks.splice(indexTask, 1)
            taskForm.remove();
        })
        .catch(error => console.log(error))
}

function outputOpenTasks() {
    const result = tasks.filter(task => task.done == false)
    return result.forEach(outputTask);
}

let openTask = document.getElementById('completed')
openTask.onclick = () => {
    openTask.style = "background-color:coral"
    allTasks.style = "background-color:khali"
    list.replaceChildren();
    outputOpenTasks();
}

allTasks.onclick = () => {
    allTasks.style = "background-color:coral"
    openTask.style = "background-color:khali"
    list.replaceChildren();
    outputAllTasks(tasks);
}

let createTaskButton = document.getElementById("create");
let form = document.getElementById('form')
createTaskButton.onclick = () => {
    createTaskButton.style = "background-color:coral;"
    form.style = "display:block;"
}

const taskForm = document.forms['task'];
let error = document.getElementById('error_create')
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const task = Object.fromEntries(formData.entries());
    task['done'] = false;
    if (task.name) {
        task.due_date ? '' : task.due_date = null;
        createTask(task)
            .then((data) => {
                outputTask(data)
                tasks.push(data)
                taskForm.reset();
                form.style = "display:none;"
                error.style = "display:none;"
                createTaskButton.style = "background-color:khali";
            })
            .catch(error => console.log(error))
    } else { error.style = "display:block;" }
})
const tasksEndpoint = 'http://localhost:8000/tasks';
function createTask(task) {
    return fetch(tasksEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json())
}


fetch(tasksEndpoint)
    .then(response => response.json())
    .then((data) => {
        tasks = data;
        outputAllTasks(tasks);
    })
    .catch(error => console.log(error))

function removeTaskFromDb(taskId) {
    let id = {
        id: taskId.textContent
    };
    return fetch(tasksEndpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    })

}

function updateStatusInDb(id, done) {
    let update = {
        id: id,
        done: done
    }
    return fetch(tasksEndpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
    })
}
