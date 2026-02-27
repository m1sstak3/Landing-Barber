document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // 3. Date Input Logic (Set min date to today with Flatpickr)
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        flatpickr(dateInput, {
            locale: "ru",
            minDate: "today",
            dateFormat: "Y-m-d",
            disableMobile: "true",
            onChange: function (selectedDates, dateStr, instance) {
                populateTimeSlots();
            }
        });

        // Initial populate
        populateTimeSlots();
    }

    function populateTimeSlots() {
        const timeItemsContainer = document.getElementById('booking-time-items');
        const timeSelect = document.getElementById('time-select');
        const timeInput = document.getElementById('time-input');

        if (!timeItemsContainer) return;

        timeItemsContainer.innerHTML = '';

        // Reset selected time
        const selectedTimeDiv = timeSelect.querySelector('.select-selected');
        if (selectedTimeDiv) {
            selectedTimeDiv.textContent = '— Выбрать время —';
        }
        if (timeInput) timeInput.value = '';

        // Mock data for available slots
        const slots = ['10:00', '11:00', '12:30', '14:00', '16:00', '18:30', '19:00', '20:30'];

        slots.forEach(slot => {
            const div = document.createElement('div');
            div.setAttribute('data-value', slot);
            div.textContent = slot;
            div.addEventListener('click', function () {
                // Remove same-as-selected class from all items
                const y = this.parentNode.getElementsByClassName("same-as-selected");
                for (let k = 0; k < y.length; k++) {
                    y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                selectedTimeDiv.textContent = this.textContent;
                if (timeInput) timeInput.value = this.getAttribute('data-value');
                selectedTimeDiv.click(); // Close dropdown
            });
            timeItemsContainer.appendChild(div);
        });
    }

    // 3.5 Custom Select Logic
    const customSelects = document.getElementsByClassName("custom-select");
    for (let i = 0; i < customSelects.length; i++) {
        const selElmnt = customSelects[i];
        const selectedDiv = selElmnt.querySelector('.select-selected');
        const itemsDiv = selElmnt.querySelector('.select-items');
        const inputHidden = selElmnt.nextElementSibling;

        // Items click logic (for static items like service)
        if (selElmnt.id === 'service-select') {
            const items = itemsDiv.getElementsByTagName("div");
            for (let j = 0; j < items.length; j++) {
                items[j].addEventListener("click", function (e) {
                    const y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (let k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    selectedDiv.textContent = this.textContent;
                    if (inputHidden) inputHidden.value = this.getAttribute('data-value');
                    selectedDiv.click(); // close dropdown
                });
            }
        }

        // Selected div click logic to toggle dropdown
        selectedDiv.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextElementSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    function closeAllSelect(elmnt) {
        const x = document.getElementsByClassName("select-items");
        const y = document.getElementsByClassName("select-selected");
        const arrNo = [];
        for (let i = 0; i < y.length; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (let i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    document.addEventListener("click", closeAllSelect);

    // 4. Booking Form Submission (Mock)
    const bookingForm = document.getElementById('booking-form');
    const modalOverlay = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data for console log
            const formData = new FormData(bookingForm);
            const bookingDetails = Object.fromEntries(formData.entries());
            console.log("Mock Booking Submission:", bookingDetails);

            // Show Success Modal
            modalOverlay.classList.add('active');

            // Reset form
            bookingForm.reset();

            // Reset custom selects and flatpickr
            const serviceSelected = document.querySelector('#service-select .select-selected');
            if (serviceSelected) serviceSelected.textContent = '— Выбрать —';
            const serviceInput = document.getElementById('service-input');
            if (serviceInput) serviceInput.value = '';

            if (dateInput && dateInput._flatpickr) {
                dateInput._flatpickr.clear();
            }

            populateTimeSlots();
        });
    }

    // 5. Modal Close logic
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // 6. Smooth scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
