const todos = [
  {
    title: "Dashboard 1",
    tasks: [
      {
        name: "Task 1",
        selected: true
      },
      {
        name: "Task 2",
        selected: false
      },
      {
        name: "Task 3",
        selected: true
      }
    ]
  },
  {
    title: "Dashboard 2",
    tasks: [
      {
        name: "Task 1",
        selected: false
      },
      {
        name: "Task 2",
        selected: true
      }
    ]
  }
];

const loadDashboards = todos => {
  todos.forEach(item => {
    const dashboard = new DOMParser().parseFromString(
      `
      <div class="dashboard">
        <img
          src="img/trash.svg"
          class="trash"
          alt="Trash"
          draggable="false"
        />
        <div class="dashboard-title-wrapper">
          <input type="text" class="dashboard-title" value="${item.title}" />
          <span class="underline"></span>
        </div>
      </div>
      `,
      "text/html"
    ).body.firstChild;

    item.tasks.forEach(item => {
      const task = new DOMParser().parseFromString(
        `
        <div class="task ${item.selected ? "selected" : ""}">
          <div class="checkbox"></div>
          ${item.name}
        </div>
        `,
        "text/html"
      ).body.firstChild;
      dashboard.appendChild(task);
    });

    const addTask = new DOMParser().parseFromString(
      `
      <div class="add-task-wrapper">
        <input type="text" class="add-task" placeholder="Add to-do" />
        <span class="underline"></span>
      </div>
      `,
      "text/html"
    ).body.firstChild;
    dashboard.appendChild(addTask);
    document.querySelector("main").appendChild(dashboard);
  });
};

loadDashboards(todos);

const tasks = document.querySelectorAll(".task");
tasks.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("selected");
  });
});

const floatingBtn = document.querySelector(".floating-btn");
floatingBtn.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active");
});

const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active");
});
