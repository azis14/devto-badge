// This is a serverless function (e.g., for Vercel, Netlify).
// It fetches data from the Dev.to API and renders it as an SVG image.
//
// How to deploy (Vercel Example):
// 1. Create a new project on Vercel and link it to a GitHub repository.
// 2. Create a folder named `api` in your repository.
// 3. Save this code as a file inside the `api` folder, e.g., `api/index.js`.
// 4. Vercel will automatically deploy this as a serverless function.
//
// How to use:
// Once deployed, you can use it in your Markdown like this:
// ![Dev.to Post Card](https://your-vercel-app-url.vercel.app/api?username=your-username&slug=your-post-slug)
// Or by parsing the full URL:
// ![Dev.to Post Card](https://your-vercel-app-url.vercel.app/api?url=https://dev.to/user/post-slug)
//
// Theme support:
// Add &theme=dark for dark mode or &theme=light (default) for light mode:
// ![Dev.to Post Card](https://your-vercel-app-url.vercel.app/api?username=your-username&slug=your-post-slug&theme=dark)


// We use node-fetch for making API requests on the server.
// In a Vercel environment, you might need to add "node-fetch" to your package.json
const fetch = require('node-fetch');

// Helper function to fetch an image and convert it to a Base64 data URI.
// This is crucial for embedding images directly into the SVG.
async function toBase64(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type');
        return `data:${contentType};base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error("Error converting image to Base64:", error);
        return null; // Return null on error
    }
}

// Helper to sanitize text for SVG
function sanitizeText(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
}

// Main handler for the serverless function
module.exports = async (req, res) => {
    try {
        let { username, slug, url: postUrl, theme = 'light', hide = '' } = req.query;

        // Validate theme parameter
        if (!['light', 'dark'].includes(theme)) {
            theme = 'light';
        }

        // Parse hide parameter
        const hideComponents = hide ? hide.split(',').map(c => c.trim().toLowerCase()) : [];
        const shouldHide = (component) => hideComponents.includes(component);

        // --- 1. Parse Input ---
        if (postUrl) {
            try {
                const url = new URL(postUrl);
                if (url.hostname !== 'dev.to') {
                    throw new Error('Invalid hostname.');
                }
                const pathParts = url.pathname.split('/').filter(part => part);
                username = pathParts[0];
                slug = pathParts[1];
            } catch (e) {
                res.status(400).send("Invalid Dev.to URL provided.");
                return;
            }
        }

        if (!username || !slug) {
            res.status(400).send("Please provide a username and slug, or a full Dev.to URL.");
            return;
        }

        // --- 2. Fetch Data from Dev.to API ---
        const articleResponse = await fetch(`https://dev.to/api/articles/${username}/${slug}`);
        if (!articleResponse.ok) {
            res.status(404).send("Article not found.");
            return;
        }
        const article = await articleResponse.json();

        // --- 3. Fetch and Encode Images ---
        // We fetch the cover image and profile picture in parallel
        const [coverImageBase64, profileImageBase64] = await Promise.all([
            article.cover_image && !shouldHide('image') ? toBase64(article.cover_image) : Promise.resolve(null),
            article.user.profile_image_90 ? toBase64(article.user.profile_image_90) : Promise.resolve(null)
        ]);

        // --- 4. Construct the SVG ---
        const { title, description, user, tags, reading_time_minutes, public_reactions_count } = article;

        // Logic to wrap the title text if it's too long
        const maxTitleChars = 45;
        let titleLine1 = sanitizeText(title);
        let titleLine2 = '';
        if (titleLine1.length > maxTitleChars) {
            let breakPoint = titleLine1.lastIndexOf(' ', maxTitleChars);
            if (breakPoint === -1) breakPoint = maxTitleChars;
            titleLine2 = titleLine1.substring(breakPoint + 1);
            titleLine1 = titleLine1.substring(0, breakPoint);
            if (titleLine2.length > maxTitleChars) {
                 titleLine2 = titleLine2.substring(0, maxTitleChars) + '...';
            }
        }
        
        // Logic to wrap the description text
        const maxDescChars = 60;
        let descLine1 = '';
        let descLine2 = '';
        if (description) {
            descLine1 = sanitizeText(description);
            if (descLine1.length > maxDescChars) {
                let breakPoint = descLine1.lastIndexOf(' ', maxDescChars);
                if (breakPoint === -1) breakPoint = maxDescChars;
                descLine2 = descLine1.substring(breakPoint + 1);
                descLine1 = descLine1.substring(0, breakPoint);
                if (descLine2.length > maxDescChars) {
                    descLine2 = descLine2.substring(0, maxDescChars) + '...';
                }
            }
        }
        
        const tagsString = !shouldHide('tags') ? tags.slice(0, 3).map(tag => `#${tag}`).join('  ') : '';

        // Calculate dynamic positioning based on hidden elements
        const hasImage = coverImageBase64 && !shouldHide('image');
        const contentStartY = hasImage ? 130 : 30;

        const svg = `
            <svg width="450" height="290" viewBox="0 0 450 290" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <style>
                    /* Base styles */
                    .card {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
                    }
                    
                    /* Light theme (default) */
                    .bg-white { fill: #ffffff; }
                    .border-gray-200 { stroke: #e5e7eb; }
                    .text-gray-900 { fill: #111827; }
                    .text-gray-700 { fill: #374151; }
                    .text-gray-600 { fill: #4b5563; }
                    .text-gray-500 { fill: #6b7280; }
                    .text-indigo-600 { fill: #4f46e5; }
                    
                    /* Dark theme */
                    .dark .bg-white { fill: #1f2937; }
                    .dark .border-gray-200 { stroke: #374151; }
                    .dark .text-gray-900 { fill: #f9fafb; }
                    .dark .text-gray-700 { fill: #d1d5db; }
                    .dark .text-gray-600 { fill: #9ca3af; }
                    .dark .text-gray-500 { fill: #9ca3af; }
                    .dark .text-indigo-600 { fill: #818cf8; }
                    
                    /* Typography */
                    .text-lg { font-size: 18px; }
                    .text-base { font-size: 15px; }
                    .text-sm { font-size: 14px; }
                    .text-xs { font-size: 12px; }
                    .font-bold { font-weight: 700; }
                    .font-medium { font-weight: 500; }
                    .font-semibold { font-weight: 600; }
                    
                    /* Shadows for light theme */
                    .shadow-sm {
                        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
                    }
                    
                    /* Shadows for dark theme */
                    .dark .shadow-sm {
                        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
                    }
                </style>
                
                <g class="${theme}">
                    <!-- Card Background with shadow -->
                    <rect class="card bg-white border-gray-200 shadow-sm" x="0.5" y="0.5" width="449" height="289" rx="8" stroke-width="1"/>
                
                    <!-- Cover Image -->
                    ${hasImage ? `
                        <defs>
                            <clipPath id="clipCover">
                                <rect x="15" y="15" width="420" height="100" rx="6"/>
                            </clipPath>
                        </defs>
                        <image href="${coverImageBase64}" x="15" y="15" height="100" width="420" clip-path="url(#clipCover)" preserveAspectRatio="xMidYMid slice" opacity="0.95"/>
                    ` : ''}

                    <!-- Content Area -->
                    <g transform="translate(15, ${contentStartY})">
                        <!-- Title -->
                        <text x="0" y="20" class="text-gray-900 text-lg font-bold">${titleLine1}</text>
                        ${titleLine2 ? `<text x="0" y="42" class="text-gray-900 text-lg font-bold">${titleLine2}</text>` : ''}
                        
                        <!-- Description -->
                        ${descLine1 ? `
                            <text x="0" y="${titleLine2 ? '65' : '43'}" class="text-gray-600 text-base">${descLine1}</text>
                            ${descLine2 ? `<text x="0" y="${titleLine2 ? '83' : '61'}" class="text-gray-600 text-base">${descLine2}</text>` : ''}
                        ` : ''}
                        
                        <!-- Author Info -->
                        <g transform="translate(0, ${descLine1 ? (descLine2 ? '90' : '80') : '70'})">
                            ${profileImageBase64 ? `
                                <defs>
                                    <clipPath id="clipAvatar">
                                        <circle cx="14" cy="14" r="14"/>
                                    </clipPath>
                                </defs>
                                <image href="${profileImageBase64}" x="0" y="0" height="28" width="28" clip-path="url(#clipAvatar)"/>
                            ` : ''}
                            <text x="36" y="19" class="text-gray-700 text-sm font-medium">${sanitizeText(user.name)}</text>
                        </g>

                        <!-- Bottom Stats -->
                        <g transform="translate(0, ${descLine1 ? (descLine2 ? '135' : '125') : '115'})">
                             ${!shouldHide('reactions') || !shouldHide('minreads') ? `
                                 <text class="text-gray-500 text-xs font-medium">
                                     ${!shouldHide('reactions') ? `${public_reactions_count} Reactions` : ''}
                                     ${!shouldHide('reactions') && !shouldHide('minreads') ? '  •  ' : ''}
                                     ${!shouldHide('minreads') ? `${reading_time_minutes} min read` : ''}
                                 </text>
                             ` : ''}
                             ${tagsString ? `<text x="420" y="0" text-anchor="end" class="text-indigo-600 text-xs font-semibold">${sanitizeText(tagsString)}</text>` : ''}
                        </g>
                    </g>
                </g>
            </svg>
        `;

        // --- 5. Send the Response ---
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
        res.status(200).send(svg);

    } catch (error) {
        console.error(error);
        // Return a generic error SVG with theme support
        const errorSvg = `
            <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .error-bg { fill: #ffffff; }
                    .error-border { stroke: #e5e7eb; }
                    .error-text { fill: #ef4444; }
                    .dark .error-bg { fill: #1f2937; }
                    .dark .error-border { stroke: #374151; }
                    .dark .error-text { fill: #f87171; }
                </style>
                <g class="${theme === 'dark' ? 'dark' : ''}">
                    <rect class="error-bg error-border" x="0.5" y="0.5" width="449" height="249" rx="8" stroke-width="1"/>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16px" class="error-text">
                        Could not generate Dev.to card.
                    </text>
                </g>
            </svg>
        `;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(500).send(errorSvg);
    }
};
