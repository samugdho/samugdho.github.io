$(document).ready(function() {
  // Initialize dark mode
  var isDarkMode = false;
  toggleLightMode(isDarkMode);

  // Handle dark mode toggle button click
  $('#light-mode-toggle').on('click', function() {
    isDarkMode = !isDarkMode;
    toggleLightMode(isDarkMode);
  });
});

function toggleLightMode(isDarkMode) {
  if (isDarkMode) {
    $('body').addClass('light-mode');
  } else {
    $('body').removeClass('light-mode');
  }
}
