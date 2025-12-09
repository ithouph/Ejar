$content = Get-Content 'pages\AddPost.js' -Raw

# Fix the pickImages function to extract URIs
$pattern = "if \(selectedImages\.length > 0\) \{\s+setImages\(selectedImages\);"
$replacement = "if (selectedImages.length > 0) {`r`n        // Extract URIs from the image objects`r`n        const imageUris = selectedImages.map(img => img.uri);`r`n        setImages(imageUris);"

$content = $content -replace $pattern, $replacement

Set-Content 'pages\AddPost.js' -Value $content -NoNewline
Write-Host "Fixed pickImages function in AddPost.js"
