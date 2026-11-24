
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("sidebarOverlay");
const logoutBtn = document.getElementById("logoutBtn");

let sidebarCollapsed = false;

// Open or collapse sidebar
menuBtn.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
        // Mobile sidebar
        sidebar.classList.toggle("-translate-x-full");
        overlay.classList.toggle("hidden");
    } else {
        // Desktop sidebar
        sidebarCollapsed = !sidebarCollapsed;

        sidebar.classList.toggle("w-64", !sidebarCollapsed);
        sidebar.classList.toggle("w-20", sidebarCollapsed);

        document.querySelectorAll(".sidebar-label").forEach(label => {
            label.classList.toggle("hidden", sidebarCollapsed);
        });
    }
});

// Close mobile sidebar when clicking outside
overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});

// Logout
logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        window.location.href = "./index.html";
    }
});
