document.getElementById('openButton').addEventListener('click', () => {
  const filePath = 'admin-console.zip'; // Adjust the file path if the zip file is in a different location

  // Create an anchor element
  const anchor = document.createElement('a');
  anchor.href = filePath;
  anchor.target = '_blank';

  // Trigger a click event on the anchor to open the file
  anchor.click();
});

