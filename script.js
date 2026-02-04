document.addEventListener("DOMContentLoaded", () => {
	// Select all links with hashes
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			// Only prevent default if the link acts as a scroll trigger
			e.preventDefault();

			const targetId = this.getAttribute("href");
			if (targetId === "#") {
				window.scrollTo({
					top: 0,
					behavior: "smooth",
				});
				return;
			}

			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		});
	});

	// Header Scroll Effect
	const header = document.querySelector("header");
	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			header.classList.add("scrolled");
		} else {
			header.classList.remove("scrolled");
		}
	});
});
