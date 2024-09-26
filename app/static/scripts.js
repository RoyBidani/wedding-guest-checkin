document.addEventListener("DOMContentLoaded", function () {
    const nameSearch = document.getElementById("nameSearch");
    const nameList = document.getElementById("nameList");
    const addGuestButton = document.getElementById("addGuestButton");
    const modal = document.getElementById("addGuestModal");
    const closeModal = document.querySelector(".close");
    const addGuestForm = document.getElementById("addGuestForm");
    const toast = document.createElement('div');
    toast.className = "toast";
    document.body.appendChild(toast);

    function showToast(message) {
        toast.textContent = message;
        toast.className = "toast show";
        setTimeout(() => { 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);  // Hide the toast after 3 seconds
    }

    nameSearch.addEventListener("input", function () {
        const query = nameSearch.value;
        fetch("/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "query=" + encodeURIComponent(query)
        })
        .then(response => response.json())
        .then(data => {
            nameList.innerHTML = "";
            data.forEach(item => {
                const li = document.createElement("li");

                const phoneNum = "0" + item.PhoneNum;

                li.innerHTML = `
                    <div class="guest-container">
                        <div class="guest-name">${item.Name}</div>
                        <div class="guest-table">Table: ${item.Table}</div>
                        <div class="guest-details">Phone: ${phoneNum}</div>
                        <div class="button-container">
                            <button class="check-in-btn">Check-In</button>
                            <button class="unmark-btn">Unmark</button>
                        </div>
                    </div>`;

                const checkInButton = li.querySelector(".check-in-btn");
                if (item.Status === "Arrived") {
                    checkInButton.textContent = "Checked In";
                    checkInButton.classList.add("checked-in");
                    checkInButton.disabled = true;
                }

                checkInButton.addEventListener("click", function () {
                    fetch("/mark_arrived", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: "name=" + encodeURIComponent(item.Name)
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.status === "success") {
                            checkInButton.textContent = "Checked In";
                            checkInButton.classList.add("checked-in");
                            checkInButton.disabled = true;
                            showToast("Guest successfully marked as arrived!");
                        } else {
                            showToast("Failed to mark as arrived.");
                        }
                    });
                });

                const unmarkButton = li.querySelector(".unmark-btn");
                unmarkButton.addEventListener("click", function () {
                    fetch("/unmark_arrived", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: "name=" + encodeURIComponent(item.Name)
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.status === "success") {
                            checkInButton.textContent = "Check-In";
                            checkInButton.classList.remove("checked-in");
                            checkInButton.disabled = false;
                            showToast("Guest successfully unmarked.");
                        } else {
                            showToast("Failed to unmark.");
                        }
                    });
                });

                nameList.appendChild(li);
            });
        });
    });

    // Modal handling for adding guests
    addGuestButton.onclick = function () {
        modal.style.display = "block";
    };

    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Add guest form submission
    addGuestForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newGuestName = document.getElementById("newGuestName").value;
        const newGuestPhone = document.getElementById("newGuestPhone").value;

        fetch("/add_guest", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `name=${encodeURIComponent(newGuestName)}&phone=${encodeURIComponent(newGuestPhone)}`
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {
                showToast("Guest successfully added and marked as arrived!");
                modal.style.display = "none";
            } else {
                showToast("Failed to add guest.");
            }
        });
    });
});

