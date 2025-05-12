document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.github.com/repos/adaengine/adaengine')
        .then(response => response.json())
        .then(data => {
            const starCount = data.stargazers_count.toLocaleString();
            document.getElementById('main-page-callout-stars-count').textContent = `${starCount} stars on GitHub`;
        })
        .catch(error => {
            console.error('Error fetching star count:', error);
            document.getElementById('main-page-callout-stars-count').textContent = 'GitHub';
        });
});
