
// ==========================================
// PHARMAFLOW - EMPLOYEE MANAGEMENT
// Temporary frontend data
// ==========================================

let employees = [
    {
        id: 1001,
        name: "Ahmad Khan",
        gender: "Male",
        department: "Production",
        phone: "0700123456",
        email: "ahmad@example.com",
        hireDate: "2024-01-15",
        role: "Production Manager",
        status: "Active",
        hoursWorked: 160,
        salaryPerHour: 150
    },
    {
        id: 1002,
        name: "Fatima Ahmad",
        gender: "Female",
        department: "Quality Control",
        phone: "0700234567",
        email: "fatima@example.com",
        hireDate: "2023-06-10",
        role: "QC Officer",
        status: "Active",
        hoursWorked: 150,
        salaryPerHour: 120
    },
    {
        id: 1003,
        name: "Mohammad Ali",
        gender: "Male",
        department: "Warehouse",
        phone: "0700345678",
        email: "mohammad@example.com",
        hireDate: "2022-09-20",
        role: "Warehouse Supervisor",
        status: "Inactive",
        hoursWorked: 100,
        salaryPerHour: 100
    },
    {
        id: 1004,
        name: "Aisha Rahimi",
        gender: "Female",
        department: "Finance",
        phone: "0700456789",
        email: "aisha@example.com",
        hireDate: "2024-03-05",
        role: "Accountant",
        status: "Active",
        hoursWorked: 160,
        salaryPerHour: 130
    }
];

// ==========================================
// DOM ELEMENTS
// ==========================================

const tableBody = document.getElementById("employeeTableBody");
const employeeModal = document.getElementById("employeeModal");
const employeeForm = document.getElementById("employeeForm");
const modalTitle = document.getElementById("modalTitle");

const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");

const totalEmployees = document.getElementById("totalEmployees");
const activeEmployees = document.getElementById("activeEmployees");
const inactiveEmployees = document.getElementById("inactiveEmployees");
const departmentCount = document.getElementById("departmentCount");
const showingCount = document.getElementById("showingCount");

const toast = document.getElementById("toast");

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function formatMoney(amount) {
    return Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function getSalary(employee) {
    return Number(employee.hoursWorked) * Number(employee.salaryPerHour);
}

function showToast(message, type = "success") {
    toast.textContent = message;

    toast.className = "fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl px-5 py-4 text-sm font-medium text-white shadow-xl";

    toast.classList.add(
        type === "error" ? "bg-red-600" : "bg-slate-900"
    );

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

// ==========================================
// RENDER EMPLOYEES
// ==========================================

function renderEmployees() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedDepartment = departmentFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch =
            String(employee.id).includes(searchValue) ||
            employee.name.toLowerCase().includes(searchValue) ||
            employee.phone.toLowerCase().includes(searchValue);

        const matchesDepartment =
            !selectedDepartment ||
            employee.department === selectedDepartment;

        const matchesStatus =
            !selectedStatus ||
            employee.status === selectedStatus;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    if (filteredEmployees.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-5 py-12 text-center text-slate-400">
                    <div class="text-3xl">♙</div>
                    <p class="mt-3 font-medium">No employees found</p>
                    <p class="mt-1 text-xs">Try changing your search or filters.</p>
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = filteredEmployees.map(employee => `
            <tr class="transition hover:bg-slate-50">
                <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            ${escapeHTML(employee.name.charAt(0).toUpperCase())}
                        </div>
                        <div>
                            <p class="font-semibold text-slate-800">
                                ${escapeHTML(employee.name)}
                            </p>
                            <p class="text-xs text-slate-400">
                                ID: ${employee.id}
                            </p>
                        </div>
                    </div>
                </td>

                <td class="px-5 py-4 text-slate-600">
                    ${escapeHTML(employee.department)}
                </td>

                <td class="px-5 py-4 text-slate-600">
                    ${escapeHTML(employee.phone)}
                </td>

                <td class="px-5 py-4 text-slate-600">
                    ${escapeHTML(employee.role)}
                </td>

                <td class="px-5 py-4 font-medium text-slate-700">
                    ${formatMoney(getSalary(employee))}
                </td>

                <td class="px-5 py-4">
                    <span class="rounded-full px-3 py-1 text-xs font-semibold ${
                        employee.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                    }">
                        ${escapeHTML(employee.status)}
                    </span>
                </td>

                <td class="px-5 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button
                            data-action="edit"
                            data-id="${employee.id}"
                            class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                            Edit
                        </button>

                        <button
                            data-action="delete"
                            data-id="${employee.id}"
                            class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    showingCount.textContent = filteredEmployees.length;

    updateStatistics();
}

// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {
    totalEmployees.textContent = employees.length;

    activeEmployees.textContent = employees.filter(
        employee => employee.status === "Active"
    ).length;

    inactiveEmployees.textContent = employees.filter(
        employee => employee.status === "Inactive"
    ).length;

    departmentCount.textContent = new Set(
        employees.map(employee => employee.department)
    ).size;
}

// ==========================================
// DEPARTMENT FILTER
// ==========================================

function updateDepartmentFilter() {
    const selectedValue = departmentFilter.value;

    const departments = [...new Set(
        employees.map(employee => employee.department)
    )].sort();

    departmentFilter.innerHTML = `
        <option value="">All Departments</option>
        ${departments.map(department => `
            <option value="${escapeHTML(department)}">
                ${escapeHTML(department)}
            </option>
        `).join("")}
    `;

    if (departments.includes(selectedValue)) {
        departmentFilter.value = selectedValue;
    }
}

// ==========================================
// OPEN AND CLOSE MODAL
// ==========================================

function openModal() {
    employeeModal.classList.remove("hidden");
    employeeModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
}

function closeModal() {
    employeeModal.classList.add("hidden");
    employeeModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    employeeForm.reset();
    document.getElementById("employeeId").value = "";
    document.getElementById("calculatedSalary").textContent = "0.00";
}

function resetFormForAdd() {
    employeeForm.reset();

    document.getElementById("employeeId").value = "";
    document.getElementById("status").value = "Active";

    modalTitle.textContent = "Add Employee";
    document.getElementById("saveEmployeeBtn").textContent = "Save Employee";

    document.getElementById("calculatedSalary").textContent = "0.00";

    openModal();
}

// ==========================================
// CALCULATE SALARY
// ==========================================

function calculateSalary() {
    const hours = Number(document.getElementById("hoursWorked").value) || 0;
    const rate = Number(document.getElementById("salaryPerHour").value) || 0;

    document.getElementById("calculatedSalary").textContent =
        formatMoney(hours * rate);
}

document.getElementById("hoursWorked").addEventListener("input", calculateSalary);
document.getElementById("salaryPerHour").addEventListener("input", calculateSalary);

// ==========================================
// ADD EMPLOYEE
// ==========================================

document.getElementById("addEmployeeBtn").addEventListener("click", () => {
    resetFormForAdd();
});

// ==========================================
// EDIT EMPLOYEE
// ==========================================

function editEmployee(id) {
    const employee = employees.find(item => item.id === id);

    if (!employee) return;

    document.getElementById("employeeId").value = employee.id;
    document.getElementById("employeeName").value = employee.name;
    document.getElementById("gender").value = employee.gender;
    document.getElementById("department").value = employee.department;
    document.getElementById("phone").value = employee.phone;
    document.getElementById("email").value = employee.email;
    document.getElementById("hireDate").value = employee.hireDate;
    document.getElementById("role").value = employee.role;
    document.getElementById("status").value = employee.status;
    document.getElementById("hoursWorked").value = employee.hoursWorked;
    document.getElementById("salaryPerHour").value = employee.salaryPerHour;

    modalTitle.textContent = "Edit Employee";
    document.getElementById("saveEmployeeBtn").textContent = "Update Employee";

    calculateSalary();
    openModal();
}

// ==========================================
// DELETE EMPLOYEE
// ==========================================

function deleteEmployee(id) {
    const employee = employees.find(item => item.id === id);

    if (!employee) return;

    const confirmed = confirm(
        `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    employees = employees.filter(item => item.id !== id);

    updateDepartmentFilter();
    renderEmployees();

    showToast("Employee deleted successfully.");
}

// ==========================================
// FORM SUBMISSION
// ==========================================

employeeForm.addEventListener("submit", event => {
    event.preventDefault();

    const id = document.getElementById("employeeId").value;

    const employeeData = {
        name: document.getElementById("employeeName").value.trim(),
        gender: document.getElementById("gender").value,
        department: document.getElementById("department").value,
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        hireDate: document.getElementById("hireDate").value,
        role: document.getElementById("role").value.trim(),
        status: document.getElementById("status").value,
        hoursWorked: Number(document.getElementById("hoursWorked").value),
        salaryPerHour: Number(document.getElementById("salaryPerHour").value)
    };

    if (
        !employeeData.name ||
        !employeeData.gender ||
        !employeeData.department ||
        !employeeData.phone ||
        !employeeData.hireDate ||
        !employeeData.role ||
        !employeeData.status ||
        !Number.isFinite(employeeData.hoursWorked) ||
        employeeData.hoursWorked < 0 ||
        !Number.isFinite(employeeData.salaryPerHour) ||
        employeeData.salaryPerHour < 0
    ) {
        showToast("Please enter valid employee information.", "error");
        return;
    }

    // Update existing employee
    if (id) {
        const index = employees.findIndex(item => item.id === Number(id));

        if (index === -1) return;

        employees[index] = {
            ...employees[index],
            ...employeeData
        };

        showToast("Employee updated successfully.");
    }

    // Add new employee
    else {
        const newEmployee = {
            id: employees.length
                ? Math.max(...employees.map(item => item.id)) + 1
                : 1001,
            ...employeeData
        };

        employees.push(newEmployee);

        showToast("Employee added successfully.");
    }

    closeModal();
    updateDepartmentFilter();
    renderEmployees();
});

// ==========================================
// TABLE ACTIONS
// ==========================================

tableBody.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.action === "edit") {
        editEmployee(id);
    }

    if (button.dataset.action === "delete") {
        deleteEmployee(id);
    }
});

// ==========================================
// SEARCH AND FILTERS
// ==========================================

searchInput.addEventListener("input", renderEmployees);
departmentFilter.addEventListener("change", renderEmployees);
statusFilter.addEventListener("change", renderEmployees);

// ==========================================
// MODAL BUTTONS
// ==========================================

document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelModalBtn").addEventListener("click", closeModal);

employeeModal.addEventListener("click", event => {
    if (event.target === employeeModal) {
        closeModal();
    }
});

// ==========================================
// SIDEBAR
// ==========================================

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("sidebarOverlay");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
});

overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});

// ==========================================
// LOGOUT
// ==========================================

document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "../index.html";
    }
});

// ==========================================
// INITIALIZE PAGE
// ==========================================

updateDepartmentFilter();
renderEmployees();
