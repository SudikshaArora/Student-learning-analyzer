// --------- Helper: normalization ----------
function normalize(val, min, max) {
  if (max - min === 0) return 0;
  return (val - min) / (max - min);
}

// --------- Archetypes and ranges ----------
const archetypes = [
  // Slow learner
  [60, 40, 5, 30, 1, 45, 48, 50, 41],
  // Moderate learner
  [80, 75, 7, 14, 3, 70, 73, 80, 68],
  // Fast learner
  [97, 92, 9.5, 5, 5, 95, 88, 98, 92]
];

const featureMins = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const featureMaxs = [100, 100, 10, 100, 10, 100, 100, 100, 100];

// --------- Classifier ----------
function classifyStudent(input) {
  const normInput = input.map((v, i) =>
    normalize(v, featureMins[i], featureMaxs[i])
  );

  const normArchetypes = archetypes.map(a =>
    a.map((v, i) => normalize(v, featureMins[i], featureMaxs[i]))
  );

  const distances = normArchetypes.map(a =>
    Math.sqrt(
      a.reduce(
        (sum, v, i) => sum + Math.pow(normInput[i] - v, 2),
        0
      )
    )
  );

  const minIndex = distances.indexOf(Math.min(...distances));
  return ["Slow Learner", "Moderate Learner", "Fast Learner"][minIndex];
}

// --------- Recommendations ----------
function getRecommendations(type) {
  if (type === "Slow Learner") {
    return `
      <b>Teaching Strategies:</b>
      <ul>
        <li>Provide step-by-step explanations with extra practice.</li>
        <li>Use visual aids and hands-on activities to reinforce concepts.</li>
        <li>Offer remedial workshops and extra classes.</li>
      </ul>
      <b>Student Engagement:</b>
      <ul>
        <li>Assign peer mentors or study buddies for regular help.</li>
        <li>Promote participation in a supportive, low-pressure environment.</li>
      </ul>
      <b>Progress Monitoring:</b>
      <ul>
        <li>Track progress weekly and intervene early if needed.</li>
        <li>Maintain communication with parents or guardians for support.</li>
      </ul>
    `;
  } else if (type === "Moderate Learner") {
    return `
      <b>Teaching Strategies:</b>
      <ul>
        <li>Use a mix of theoretical and practical examples.</li>
        <li>Introduce gradually more challenging assignments.</li>
      </ul>
      <b>Student Engagement:</b>
      <ul>
        <li>Arrange group discussions and collaborative projects.</li>
        <li>Encourage participation in extra-curricular activities.</li>
      </ul>
      <b>Progress Monitoring:</b>
      <ul>
        <li>Review progress bi-weekly and address specific weaknesses.</li>
      </ul>
    `;
  } else if (type === "Fast Learner") {
    return `
      <b>Teaching Strategies:</b>
      <ul>
        <li>Assign advanced projects and independent research work.</li>
        <li>Allow exploration of topics beyond the syllabus.</li>
      </ul>
      <b>Student Engagement:</b>
      <ul>
        <li>Encourage participation in Olympiads, coding contests, or fairs.</li>
        <li>Offer opportunities to tutor or lead peer groups.</li>
      </ul>
      <b>Progress Monitoring:</b>
      <ul>
        <li>Review progress monthly, focusing on depth and innovation.</li>
      </ul>
    `;
  }
  return "";
}

// --------- Dashboard data ----------
const students = [];

function updateDashboard() {
  const dashboard = document.getElementById("dashboard");
  if (!students.length) {
    dashboard.style.display = "none";
    return;
  }

  dashboard.style.display = "block";

  document.getElementById("total-students").textContent = students.length;
  document.getElementById("slow-count").textContent = students.filter(
    s => s.type === "Slow Learner"
  ).length;
  document.getElementById("moderate-count").textContent = students.filter(
    s => s.type === "Moderate Learner"
  ).length;
  document.getElementById("fast-count").textContent = students.filter(
    s => s.type === "Fast Learner"
  ).length;

  const tbody = document.querySelector("#students-table tbody");
  tbody.innerHTML = "";

  students.forEach((s, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${s.studentName}</td>
      <td>${s.enrollment}</td>
      <td>${s.attendance}</td>
      <td>${s.assignment}</td>
      <td>${s.tdp}</td>
      <td>${s.consistency}</td>
      <td>${s.extra}</td>
      <td>${s.midterm}</td>
      <td>${s.quiz}</td>
      <td>${s.lab}</td>
      <td>${s.endterm}</td>
      <td>${s.type}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --------- Main form handler ----------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("student-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = this.studentName.value.trim();
    const enrollment = this.enrollment.value.trim();

    const vals = [
      +this.attendance.value,
      +this.assignment.value,
      +this.tdp.value,
      +this.consistency.value,
      +this.extra.value,
      +this.midterm.value,
      +this.quiz.value,
      +this.lab.value,
      +this.endterm.value
    ];

    const type = classifyStudent(vals);

    document.getElementById("result").style.display = "block";
    document.getElementById("learner-type").innerHTML =
      `<strong>Learner Type:</strong> <span>${type}</span>`;
    document.getElementById("recommendations").innerHTML =
      getRecommendations(type);

    students.push({
      studentName: name,
      enrollment: enrollment,
      attendance: this.attendance.value,
      assignment: this.assignment.value,
      tdp: this.tdp.value,
      consistency: this.consistency.value,
      extra: this.extra.value,
      midterm: this.midterm.value,
      quiz: this.quiz.value,
      lab: this.lab.value,
      endterm: this.endterm.value,
      type
    });

    updateDashboard();
    this.reset();
  });
});


