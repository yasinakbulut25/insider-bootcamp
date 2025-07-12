document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const toast = document.getElementById("toastMsg");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const priorityFilter = document.getElementById("priorityFilter");

  let tasks = [];
  let filter = "all";
  let priority = "all";

  // Form Submit Event
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    try {
      const title = document.getElementById("taskTitle").value.trim();
      const description = document
        .getElementById("taskDescription")
        .value.trim();
      const priority = document.querySelector('input[name="priority"]:checked');

      if (!title) {
        showToast("Lütfen bir başlık giriniz!", true);
        return;
      }

      if (!priority) {
        showToast("Lütfen bir öncelik seviyesi seçin!", true);
        return;
      }

      const newTask = {
        id: Date.now(),
        title,
        description,
        priority: priority.value,
        completed: false,
      };

      tasks.push(newTask);
      renderTasks();
      taskForm.reset();
      showToast("Görev başarıyla eklendi!");
    } catch (err) {
      showToast(`Bir hata oluştu: ${err.message}`, true);
    }
  });

  // Delegated Event Listener for Complete & Delete Buttons
  taskList.addEventListener("click", (e) => {
    e.stopPropagation();

    const target = e.target.closest("button");
    if (!target) return;

    const taskItem = target.closest(".task-item");
    const taskId = Number(taskItem?.dataset?.id);
    if (!taskId) return;

    if (target.classList.contains("complete-btn")) {
      const task = tasks.find((t) => t.id === taskId);
      task.completed = !task.completed;
      renderTasks();
    }

    if (target.classList.contains("remove-btn")) {
      tasks = tasks.filter((t) => t.id !== taskId);
      renderTasks();
      showToast("Görev silindi.");
    }
  });

  // Filter Buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      filter = btn.textContent.includes("Tamamlananlar") ? "completed" : "all";
      renderTasks();
    });
  });

  // Priority Filter
  priorityFilter.addEventListener("change", () => {
    priority = priorityFilter.value;
    renderTasks();
  });

  // Render Tasks
  const renderTasks = () => {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter((t) => {
      const byCompletion = filter === "completed" ? t.completed : true;
      const byPriority = priority === "all" ? true : t.priority === priority;
      return byCompletion && byPriority;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML = "<p class='empty'>Henüz görev eklenmemiş.</p>";
      return;
    }

    filteredTasks.forEach((task) => {
      const { id, title, description, priority, completed } = task;
      const priorityText = getTaskPriorityText(priority);

      const taskItem = document.createElement("div");
      taskItem.className = `task-item`;
      if (completed) taskItem.classList.add("completed");
      taskItem.dataset.id = id;

      taskItem.innerHTML = `
        <div class="action-buttons">
          <button class="action-btn complete-btn">
            <i class="bi bi-check"></i>
          </button>
          <button class="action-btn remove-btn"}>
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="task-texts">
          <div class="text-top">
              <h3 class="task-title">${title}</h3>
              <span class="task-priority ${priority}">${priorityText}</span>
          </div>

          <p class="task-description">
            ${description}
          </p>
        </div>
      `;

      taskList.appendChild(taskItem);
    });
  };

  // Show Toast Message
  const showToast = (message, isError = false) => {
    const type = isError ? "error" : "success";
    toast.textContent = message;
    toast.classList.add("show", type);

    setTimeout(() => {
      toast.classList.remove("show", type);
    }, 3000);
  };

  // Priority Text (Turkish)
  const getTaskPriorityText = (value) => {
    switch (value) {
      case "low":
        return "Düşük";
      case "medium":
        return "Orta";
      case "high":
        return "Yüksek";
      default:
        return "Düşük";
    }
  };

  // Initial render
  renderTasks();
});
