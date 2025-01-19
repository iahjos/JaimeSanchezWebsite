// Select all the images in the middle section
const scrollImages = document.querySelectorAll('.scroll-image');

// Function to check if an element is in the viewport
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

// Function to handle scroll animation
function handleScrollAnimation() {
  scrollImages.forEach((img) => {
    if (isInViewport(img)) {
      img.classList.add('animate'); // Add the animate class when in viewport
    }
  });
}

// Listen for the scroll event
window.addEventListener('scroll', handleScrollAnimation);

// Run the animation check on page load
handleScrollAnimation();
