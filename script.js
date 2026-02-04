document.addEventListener("DOMContentLoaded", () => {
	// Select all links with hashes
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			// Only prevent default if the link acts as a scroll trigger
			e.preventDefault();

			const targetId = this.getAttribute("href");
			if (targetId === "#") return;

			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		});
	});
});
