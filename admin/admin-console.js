window.addEventListener('load', function() {
    // Replace "path/to/admin-console.zip" with the actual URL or path to the ZIP file
    var fileURL = "admin-console.zip";

    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileURL, true);
    xhr.responseType = 'blob';

    xhr.onload = function() {
        if (xhr.status === 200) {
            var blob = new Blob([xhr.response], { type: 'application/zip' });
            var url = URL.createObjectURL(blob);

            // Create a hidden anchor element to trigger the download
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'admin-console.zip';

            // Append the anchor to the body and click it programmatically
            document.body.appendChild(a);
            a.click();

            // Clean up the URL object after the download is complete
            URL.revokeObjectURL(url);
        }
    };

    xhr.send();
});

