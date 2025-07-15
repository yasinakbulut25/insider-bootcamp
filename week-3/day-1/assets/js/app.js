let studentData = [
  { id: 1, name: "Ali Yılmaz", class: "10A", gender: "Male" },
  { id: 2, name: "Zeynep Demir", class: "9B", gender: "Female" },
];

let currentFilter = "all";

const renderStudentList = () => {
  const list = $("#taskList");
  list.empty();

  const filtered = studentData.filter((s) => {
    if (currentFilter === "male") return s.gender === "Male";
    if (currentFilter === "female") return s.gender === "Female";
    return true;
  });

  if (filtered.length === 0) {
    list.append('<p class="empty">Filtreye uygun öğrenci yok.</p>');
    return;
  }

  filtered.forEach((student) => {
    list.append(`
      <div class="student-item" data-id="${student.id}" title="Cinsiyet: ${
      student.gender
    }">
        <div class="action-buttons">
          <button class="action-btn detail-btn"><i class="bi bi-eye"></i></button>
          <button class="action-btn remove-btn" style="display: none;"><i class="bi bi-trash"></i></button>
        </div>
        <div class="student-texts">
          <div class="text-top">
            <h3 class="student-title">
              ${student.name}
              <span class="student-gender ${
                student.gender === "Male" ? "low" : "medium"
              }">${student.gender === "Male" ? "Erkek" : "Kadın"}</span>
            </h3>
            <span class="student-gender high">${student.class}</span>
          </div>
        </div>
      </div>
    `);
  });

  // 🔄 Silme butonunu sadece hover'da göster
  $(".student-item").hover(
    () => {
      $(this).find(".remove-btn").fadeIn(150);
    },
    () => {
      $(this).find(".remove-btn").fadeOut(150);
    }
  );
};

const showToast = (msg, type = "success") => {
  const toast = $("#toastMsg");
  toast.text(msg).removeClass("success error").addClass(type).addClass("show");
  setTimeout(() => toast.removeClass("show"), 2500);
};

$(document).ready(() => {
  renderStudentList();

  $("#taskForm").on("submit", (e) => {
    e.preventDefault();
    const name = $("#studentName").val().trim();
    const studentClass = $("#studentClass").val().trim();
    const gender = $("input[name='gender']:checked").val();

    if (!name || !studentClass || !gender) {
      showToast("Tüm alanlar zorunludur!", "error");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name,
      class: studentClass,
      gender,
    };

    studentData.push(newStudent);
    renderStudentList();
    showToast("Öğrenci başarıyla eklendi!", "success");
    this.reset();
  });

  $("#taskList").on("click", ".remove-btn", (e) => {
    e.stopPropagation();
    const id = $(this).closest(".student-item").data("id");
    studentData = studentData.filter((s) => s.id !== id);
    renderStudentList();
  });

  $("#taskList").on("click", ".student-item", () => {
    $(this).toggleClass("completed");
  });

  $("#taskList").on("click", ".detail-btn", (e) => {
    e.stopPropagation();
    const id = $(this).closest(".student-item").data("id");
    const student = studentData.find((s) => s.id === id);
    alert(
      `Ad: ${student.name}\nSınıf: ${student.class}\nCinsiyet: ${student.gender}`
    );
  });

  $("#genderFilter").on("change", () => {
    currentFilter = $(this).val();
    renderStudentList();
  });
});
