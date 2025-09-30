// Blog search and filter functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('blogSearch');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const blogPosts = document.querySelectorAll('.blog-post');
    const newsletterForm = document.getElementById('newsletterForm');

    let currentCategory = 'all';

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterPosts(searchTerm, currentCategory);
        });
    }

    // Category filter functionality
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            currentCategory = filter.dataset.category;
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            filterPosts(searchTerm, currentCategory);
        });
    });

    // Filter posts based on search and category
    function filterPosts(searchTerm, category) {
        blogPosts.forEach(post => {
            const title = post.querySelector('h2').textContent.toLowerCase();
            const description = post.querySelector('p').textContent.toLowerCase();
            const postCategory = post.dataset.category;
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = category === 'all' || postCategory === category;
            
            if (matchesSearch && matchesCategory) {
                post.style.display = '';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(newsletterForm);
            const name = formData.get('name');
            const email = formData.get('email');
            
            // Here you would typically send this to a backend service
            // For now, just show a success message
            alert('¡Gracias por suscribirte! Te enviaremos actualizaciones pronto.');
            newsletterForm.reset();
        });
    }
});
