const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

let todos = [
  {
    id: generateId(),
    title: "Dashboard 1",
    tasks: [
      {
        id: generateId(),
        name: "Task 1",
        selected: true
      },
      {
        id: generateId(),
        name: "Task 2",
        selected: false
      },
      {
        id: generateId(),
        name: "Task 3",
        selected: true
      }
    ]
  },
  {
    id: generateId(),
    title: "Dashboard 2",
    tasks: [
      {
        id: generateId(),
        name: "Task 1",
        selected: false
      },
      {
        id: generateId(),
        name: "Task 2",
        selected: true
      }
    ]
  }
];

const generateTaskHtml = taskObj => {
  const task = new DOMParser().parseFromString(
    `
    <div class="task-wrapper">
      <div class="checkbox ${taskObj.selected ? "selected" : ""}"
      onclick="toggleSelected(event)"></div>
      <input class="task" value="${taskObj.name}"
      onkeypress="updateTask(event, ${taskObj.id})"
      onfocus="showUnderline(event)"
      onblur="hideUnderline(event)"
      ${taskObj.selected ? "disabled" : ""}/>
      <img
      src="img/trash.svg"
      class="trash"
      alt="Trash"
      draggable="false"
      onclick="deleteTask(event, ${taskObj.id})"
    />
    </div>
    `,
    "text/html"
  ).body.firstChild;
  return task;
};

const generateDashboardHtml = obj => {
  const dashboard = new DOMParser().parseFromString(
    `
    <div class="dashboard">
      <img
        src="img/trash.svg"
        class="trash"
        alt="Trash"
        draggable="false"
        onclick="deleteDashboard(event, ${obj.id})"
      />
      <div class="title-wrapper">
        <input type="text" class="dashboard-title" 
        value="${obj.title}"
        onkeypress="updateTitle(event, ${obj.id})"
        onfocus="showUnderline(event)"
        onblur="hideUnderline(event)"/>
      </div>
    </div>
    `,
    "text/html"
  ).body.firstChild;

  obj.tasks.forEach(task => {
    dashboard.appendChild(generateTaskHtml(task));
  });

  const addTaskField = new DOMParser().parseFromString(
    `
    <div class="add-task-wrapper">
      <input type="text" class="add-task" placeholder="Add to-do" 
      onfocus="showUnderline(event)"
      onblur="hideUnderline(event)"
      onkeypress="addTask(event, ${obj.id})"/>
    </div>
    `,
    "text/html"
  ).body.firstChild;
  dashboard.appendChild(addTaskField);
  return dashboard;
};

const loadDashboards = todos => {
  todos.forEach(item => {
    document.querySelector("main").appendChild(generateDashboardHtml(item));
  });
};

loadDashboards(todos);

const deleteDashboard = (event, id) => {
  event.target.parentElement.remove();
  todos = todos.filter(item => item.id !== id);
};

const checkFormValidation = form => {
  if (form[0].value.length > 0 && form[1].value.length > 0) {
    form["btn"].disabled = false;
  } else {
    form["btn"].disabled = true;
  }
};

const resetFormState = form => {
  form.reset();
  form.querySelector(".add-btn").disabled = true;
  form.querySelectorAll(".add-task").forEach((item, i) => {
    if (i > 0) item.remove();
  });
};

const addSidebarInput = event => {
  const formContent = event.target.parentElement;
  const tasks = Array.from(formContent.querySelectorAll(".add-task"));
  if (formContent.lastElementChild.value.length > 0) {
    const newInput = new DOMParser().parseFromString(
      `
      <input
        name="task"
        type="text"
        class="add-task"
        placeholder="Add to-do"
        oninput="addSidebarInput(event)"
      />
      `,
      "text/html"
    ).body.firstChild;
    formContent.appendChild(newInput);
  }
  tasks.reverse().forEach((item, i) => {
    if (i > 0 && item.value.length === 0) item.remove();
  });
};

const addDashboard = event => {
  event.preventDefault();
  const form = event.target;
  const title = form["title"].value;
  const tasks = Array.from(form["task"])
    .filter(elem => elem.value.length > 0)
    .map(elem => ({
      id: generateId(),
      name: elem.value,
      selected: false
    }));

  const newDashboard = {
    id: generateId(),
    title: title,
    tasks: tasks
  };

  todos.push(newDashboard);
  document
    .querySelector("main")
    .appendChild(generateDashboardHtml(newDashboard));
  hideSidebar();
  resetFormState(form);
};

const addTask = (event, dashboardId) => {
  if (event.keyCode === 13) {
    const newTask = {
      id: generateId(),
      name: event.target.value,
      selected: false
    };
    const taskHtml = generateTaskHtml(newTask);
    const addTodoInput = event.target.parentElement;
    const dashboard = addTodoInput.parentElement;
    dashboard.insertBefore(taskHtml, addTodoInput);
    todos = todos.map(item => {
      if (item.id === dashboardId) {
        item.tasks.push(newTask);
      }
      return item;
    });
    event.target.blur();
    console.log(todos);
  }
};

const deleteTask = (event, id) => {
  event.target.parentElement.remove();
  todos = todos.map(item => {
    item.tasks = item.tasks.filter(task => task.id !== id);
    return item;
  });
  console.log(todos);
};

let inputValue = "";

const updateTask = (event, id) => {
  if (event.keyCode === 13) {
    todos = todos.map(item => {
      item.tasks = item.tasks.map(task => {
        if (task.id === id) {
          task.name = event.target.value;
        }
        return task;
      });
      return item;
    });
    inputValue = event.target.value;
    event.target.blur();
    console.log(todos);
  }
};

const updateTitle = (event, id) => {
  if (event.keyCode === 13) {
    todos = todos.map(item => {
      if (item.id === id) {
        item.title = event.target.value;
      }
      return item;
    });
    inputValue = event.target.value;
    event.target.blur();
    console.log(todos);
  }
};

const toggleSelected = event => {
  const input = event.target.nextElementSibling;
  const dashboard = input.parentElement.parentElement;
  event.target.classList.toggle("selected");
  input.disabled = !input.disabled;
  todos = todos.map(item => {
    if (item.id === Number(dashboard.id)) {
      item.tasks = item.tasks.map(task => {
        if (task.id === Number(input.id)) {
          task.selected = !task.selected;
        }
        return task;
      });
    }
    return item;
  });
};

const showSidebar = () => {
  document.querySelector(".sidebar").classList.add("active");
  document.querySelector(".overlay").classList.add("active");
};

const hideSidebar = () => {
  document.querySelector(".sidebar").classList.remove("active");
  document.querySelector(".overlay").classList.remove("active");
};

const showUnderline = event => {
  event.target.parentElement.classList.add("active");
  inputValue = event.target.value;
};

const hideUnderline = event => {
  event.target.parentElement.classList.remove("active");
  event.target.value = inputValue;
};
