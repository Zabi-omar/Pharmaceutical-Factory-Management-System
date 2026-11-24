
// ========================================
// Shared Sidebar
// ========================================

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("sidebar-container");

    if (!container) {
        console.error("Sidebar container was not found.");
        return;
    }

    const root = container.dataset.root || "./";

    try {
        const response = await fetch(`${root}components/sidebar.html`);

        if (!response.ok) {
            throw new Error("Could not load sidebar component.");
        }

        container.innerHTML = await response.text();

        initializeSidebar(root, container);

    } catch (error) {
        console.error("Sidebar loading error:", error);
    }
});


// ========================================
// Initialize Sidebar
// ========================================

function initializeSidebar(root, container) {

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeSidebar");
    const toggleBtn = document.getElementById("sidebarToggle");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!sidebar) {
        console.error("Sidebar element was not found.");
        return;
    }


    // ========================================
    // Full Page Sidebar Height
    // ========================================

    function updateSidebarHeight() {

        const pageHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight
        );

        // Make the sidebar container as tall as the page
        container.style.minHeight = `${pageHeight}px`;
        container.style.alignSelf = "stretch";
        container.style.flexShrink = "0";

        // Make the sidebar fill its container
        sidebar.style.minHeight = `${pageHeight}px`;
        sidebar.style.height = `${pageHeight}px`;
    }

    updateSidebarHeight();

    window.addEventListener("load", updateSidebarHeight);
    window.addEventListener("resize", updateSidebarHeight);

    // Update height when page content changes
    const observer = new ResizeObserver(() => {
        updateSidebarHeight();
    });

    observer.observe(document.body);


    // ========================================
    // Mobile Overlay
    // ========================================

    let overlay = document.getElementById("sidebarOverlay");

    if (!overlay) {
        overlay = document.createElement("div");

        overlay.id = "sidebarOverlay";
        overlay.className =
            "fixed inset-0 z-40 hidden bg-black/50 lg:hidden";

        document.body.appendChild(overlay);
    }


    // ========================================
    // Desktop Collapse
    // ========================================

    let collapsed = false;

    function toggleDesktopSidebar() {

        collapsed = !collapsed;

        sidebar.classList.toggle("w-64", !collapsed);
        sidebar.classList.toggle("w-20", collapsed);

        sidebar.querySelectorAll(".sidebar-label").forEach(label => {
            label.classList.toggle("hidden", collapsed);
        });

        sidebar.querySelectorAll(".sidebar-link").forEach(link => {
            link.classList.toggle("justify-center", collapsed);
            link.classList.toggle("px-2", collapsed);
        });

        if (toggleBtn) {
            toggleBtn.title = collapsed
                ? "Expand sidebar"
                : "Collapse sidebar";
        }
    }


    // ========================================
    // Page Navigation
    // ========================================

    const pages = {
        dashboard: "dashboard.html",
        employees: "pages/employees.html",
        departments: "pages/departments.html",
        medicines: "pages/medicines.html",
        "raw-materials": "pages/raw-materials.html",
        production: "pages/production.html",
        "quality-control": "pages/quality-control.html",
        suppliers: "pages/suppliers.html",
        purchases: "pages/purchases.html",
        customers: "pages/customers.html",
        "sales-orders": "pages/sales-orders.html",
        distribution: "pages/distribution.html",
        expenses: "pages/expenses.html"
    };

    const currentFile = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const currentPage = currentFile.replace(".html", "");

    sidebar.querySelectorAll("[data-page]").forEach(link => {

        const page = link.dataset.page;

        if (pages[page]) {
            link.href = root + pages[page];
        }

        if (page === currentPage) {
            link.classList.add(
                "bg-blue-600",
                "text-white",
                "hover:bg-blue-600",
                "hover:text-white"
            );
        }
    });


    // ========================================
    // Mobile Sidebar
    // ========================================

    function openMobileSidebar() {
        sidebar.classList.remove("-translate-x-full");
        overlay.classList.remove("hidden");
    }

    function closeMobileSidebar() {
        sidebar.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
    }


    // ========================================
    // Main Menu Button
    // ========================================

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {

            if (window.innerWidth >= 1024) {
                toggleDesktopSidebar();
            } else {
                openMobileSidebar();
            }

        });
    }


    // ========================================
    // Sidebar Collapse Button
    // ========================================

    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleDesktopSidebar);
    }


    // ========================================
    // Close Mobile Sidebar
    // ========================================

    if (closeBtn) {
        closeBtn.addEventListener("click", closeMobileSidebar);
    }

    overlay.addEventListener("click", closeMobileSidebar);


    // ========================================
    // Logout
    // ========================================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            if (confirm("Are you sure you want to logout?")) {
                window.location.href = root + "index.html";
            }

        });

    }

}
