// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
// TASK ID
function generateTaskId() {
  if (nextId === null) {
    nextId = 1;
  } else {
    nextId++;
  }
  localStorage.setItem("nextId", JSON.stringify(nextId)); 
  return nextId;

}

// Create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>')
  .addClass('card w-75 task-card draggable my-3')
  .attr('data-task-id', task.id);
const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
const cardBody = $('<div>').addClass('card-body').text(task.description);
const cardDueDate = $('<p>').addClass('card-text').text(`Due Date: ${task.dueDate}`);
const cardDeleteBtn = $('<button>')
  .addClass('btn btn-danger-delete')
  .text('Delete')
  .attr('data-task-id', task.id);
cardDeleteBtn.on('click', handleDeleteTask);

// set card background color based on due date
if (task.dueDate && task.status !== 'done') {
  const now = dayjs();
  const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
  if (now.isSame(taskDueDate, 'day')) {
    taskCard.addClass('bg-warning text-white');
  } else if (now.isAfter(taskDueDate)) {
    taskCard.addClass('bg-danger text-white');
    cardDeleteBtn.addClass('border-light');
  }
}

// append card elements
taskCard.append(cardHeader, cardBody, cardDueDate, cardDeleteBtn);
return taskCard;
}
// Render the task list
function renderTaskList() {
  if (!taskList) taskList = [];  
  const todoList = $("#todo-cards");
  todoList.empty();
  const inProgressList = $("#in-progress-cards");
  inProgressList.empty();
  const doneList = $("#done-cards");
  doneList.empty();

for (let task of taskList) {
  const taskCard = createTaskCard(task);
  if (task.status === 'To Do') {
    todoList.append(taskCard);
  } else if (task.status === 'In Progress') {
    inProgress-List.append(taskCard) ;
  } else if (task.status === 'Done') {
    doneList.append(taskCard); 
   }
  }
  //Make cards draggable
  $(".task-card").draggable({
    opacity: 0.7,
    zIndex: 100,
    });
}
// Create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  //create a new task
  const newTask = {
    id: generateTaskId(),
    title: $("#task-title").val(),
    description: $("#task-description").val(),
    dueDate: $("#task-due-date").val(),
    status: "To Do",
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
  renderTaskList();
  $("#task-title").val();
  $("#task-description").val(); 
  $("#task-due-date").val();
  $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  event.preventDefault();
  const taskIdToDelete = $(event.target).closest('.task-card').data('task-id');
  taskList = taskList.filter((task) => task.id !== parseInt(taskIdToDelete));

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskList = taskList.map(task => task.id === taskId ? { ...task, status: newStatus } : task);
  const newStatus = event.target.id;

for (let taskList of taskList) {
  if (taskList.id === task.id)  {
    task.status = newStatus;
  }
}

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
  renderTaskList();
// Add event listeners
  $("#add-task-btn").on("click", handleAddTask);

// Make lanes droppable
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop  
  });

  // Make the due date field a date picker

  $("#task-due-date").datepicker({
    dateFormat: "yy-mm-dd"
  });
});