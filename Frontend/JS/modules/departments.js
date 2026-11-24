
document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // DOM ELEMENTS
    // ========================================

    const addBtn = document.getElementById("addDepartmentBtn");
    const modal = document.getElementById("departmentModal");
    const form = document.getElementById("departmentForm");
    const idInput = document.getElementById("departmentId");
    const nameInput = document.getElementById("departmentName");
    const tableBody = document.getElementById("departmentTableBody");
    const searchInput = document.getElementById("searchDepartment");
    const closeBtn = document.getElementById("closeDepartmentModal");
    const cancelBtn = document.getElementById("cancelDepartmentBtn");
    const totalDepartments = document.getElementById("totalDepartments");

    // Check required HTML elements
    const requiredElements = {
        addDepartmentBtn: addBtn,
        departmentModal: modal,
        departmentForm: form,
        departmentName: nameInput,
        departmentTableBody: tableBody
    };

    const missingElements = Object.entries(requiredElements)
        .filter(([id, element]) => !element)
        .map(([id]) => id);

    if (missingElements.length > 0) {
        console.error("Missing department HTML elements:", missingElements);
        return;
    }

    // ========================================
    // SAMPLE DATA
    // ========================================

    let departments = [
        { id: "DEP-001", name: "Production" },
        { id: "DEP-002", name: "Quality Control" },
        { id: "DEP-003", name: "Human Resources" },
        { id: "DEP-004", name: "Research and Development" },
        { id: "DEP-005", name: "Warehouse" },
        { id: "DEP-006", name: "Finance" },
        { id: "DEP-007", name: "Sales and Marketing" },
        { id: "DEP-008", name: "Administration" }
    ];

    let editingId = null;

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }

    function showToast(message) {
        let toast = document.getElementById("departmentToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "departmentToast";
            toast.className =
                "fixed bottom-5 right-5 z-[200] rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.remove("hidden");

        clearTimeout(toast.timeout);
        toast.timeout = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2500);
    }

    function generateId() {
        const highest = departments.reduce((max, department) => {
            const number = Number(department.id.split("-")[1]) || 0;
            return Math.max(max, number);
        }, 0);

        return `DEP-${String(highest + 1).padStart(3, "0")}`;
    }

    function openModal(department = null) {
        form.reset();

        if (department) {
            editingId = department.id;
            idInput.value = department.id;
            nameInput.value = department.name;
        } else {
            editingId = null;
            idInput.value = generateId();
        }

        modal.classList.remove("hidden");
    }

    function closeModal() {
        modal.classList.add("hidden");
        form.reset();
        editingId = null;
    }

    // ========================================
    // RENDER DEPARTMENTS
    // ========================================

    function renderDepartments() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const filtered = departments.filter(department =>
            department.id.toLowerCase().includes(searchTerm) ||
            department.name.toLowerCase().includes(searchTerm)
        );

        tableBody.innerHTML = "";

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="px-6 py-8 text-center text-slate-500">
                        No departments found.
                    </td>
                </tr>
            `;
        } else {
            filtered.forEach(department => {
                const row = document.createElement("tr");

                row.className = "border-b border-slate-100 hover:bg-slate-50";

                row.innerHTML = `
                    <td class="px-6 py-4 font-medium text-slate-700">
                        ${escapeHTML(department.id)}
                    </td>

                    <td class="px-6 py-4 text-slate-700">
                        ${escapeHTML(department.name)}
                    </td>

                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <button
                                type="button"
                                data-action="edit"
                                data-id="${escapeHTML(department.id)}"
                                class="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100">
                                Edit
                            </button>

                            <button
                                type="button"
                                data-action="delete"
                                data-id="${escapeHTML(department.id)}"
                                class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100">
                                Delete
                            </button>
                        </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        }

        if (totalDepartments) {
            totalDepartments.textContent = departments.length;
        }
    }

    // ========================================
    // ADD DEPARTMENT BUTTON
    // ========================================

    addBtn.addEventListener("click", () => {
        openModal();
    });

    // ========================================
    // CLOSE MODAL
    // ========================================

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModal);
    }

    // Close when clicking outside modal content
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // ========================================
    // ADD AND EDIT DEPARTMENT
    // ========================================

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();

        if (!name) {
            showToast("Please enter a department name.");
            nameInput.focus();
            return;
        }

        const duplicate = departments.some(department =>
            department.name.toLowerCase() === name.toLowerCase() &&
            department.id !== editingId
        );

        if (duplicate) {
            showToast("This department already exists.");
            return;
        }

        if (editingId) {
            const department = departments.find(
                item => item.id === editingId
            );

            if (department) {
                department.name = name;
                showToast("Department updated successfully.");
            }
        } else {
            departments.push({
                id: generateId(),
                name: name
            });

            showToast("Department added successfully.");
        }

        closeModal();
        renderDepartments();
    });

    // ========================================
    // EDIT AND DELETE BUTTONS
    // ========================================

    tableBody.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        const department = departments.find(item => item.id === id);

        if (!department) return;

        if (action === "edit") {
            openModal(department);
        }

        if (action === "delete") {
            const confirmed = confirm(
                `Are you sure you want to delete ${department.name}?`
            );

            if (confirmed) {
                departments = departments.filter(
                    item => item.id !== id
                );

                renderDepartments();
                showToast("Department deleted successfully.");
            }
        }
    });

    // ========================================
    // SEARCH
    // ========================================

    if (searchInput) {
        searchInput.addEventListener("input", renderDepartments);
    }

    // ========================================
    // INITIAL RENDER
    // ========================================

    renderDepartments();

    console.log("Department management initialized successfully.");
});
