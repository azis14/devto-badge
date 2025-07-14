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
        let { username, slug, url: postUrl } = req.query;

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
            article.cover_image ? toBase64(article.cover_image) : Promise.resolve(null),
            article.user.profile_image_90 ? toBase64(article.user.profile_image_90) : Promise.resolve(null)
        ]);

        // --- 4. Construct the SVG ---
        const { title, user, tags, reading_time_minutes, public_reactions_count } = article;

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
        
        const tagsString = tags.slice(0, 3).map(tag => `#${tag}`).join('  ');

        const svg = `
            <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <style>
                    .card {
                        font-family: 'Segoe UI', 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
                        border-radius: 8px;
                    }
                    .title {
                        font-size: 18px;
                        font-weight: 700;
                        fill: #111827;
                    }
                    .author {
                        font-size: 14px;
                        font-weight: 500;
                        fill: #374151;
                    }
                    .stats {
                        font-size: 12px;
                        font-weight: 500;
                        fill: #6b7280;
                    }
                    .tags {
                        font-size: 12px;
                        font-weight: 600;
                        fill: #4f46e5;
                    }
                    .dark .title { fill: #ffffff; }
                    .dark .author { fill: #d1d5db; }
                    .dark .stats { fill: #9ca3af; }
                    .dark .tags { fill: #818cf8; }
                </style>
                
                <!-- Card Background -->
                <rect class="card" x="0.5" y="0.5" width="449" height="249" rx="8" fill="white" stroke="#e5e7eb"/>
                
                <!-- Dark Mode Card -->
                <g class="dark">
                     <rect class="card" x="0.5" y="0.5" width="449" height="249" rx="8" fill="#1f2937" stroke="#374151" style="display: none;"/>
                </g>
                
                <!-- Cover Image -->
                ${coverImageBase64 ? `
                    <defs>
                        <clipPath id="clipCover">
                            <rect x="15" y="15" width="420" height="100" rx="6"/>
                        </clipPath>
                    </defs>
                    <image href="${coverImageBase64}" x="15" y="15" height="100" width="420" clip-path="url(#clipCover)" preserveAspectRatio="xMidYMid slice"/>
                ` : ''}

                <!-- Content Area -->
                <g transform="translate(15, 130)">
                    <!-- Title -->
                    <text x="0" y="20" class="title">${titleLine1}</text>
                    ${titleLine2 ? `<text x="0" y="42" class="title">${titleLine2}</text>` : ''}
                    
                    <!-- Author Info -->
                    <g transform="translate(0, 70)">
                        ${profileImageBase64 ? `
                            <defs>
                                <clipPath id="clipAvatar">
                                    <circle cx="14" cy="14" r="14"/>
                                </clipPath>
                            </defs>
                            <image href="${profileImageBase64}" x="0" y="0" height="28" width="28" clip-path="url(#clipAvatar)"/>
                        ` : ''}
                        <text x="36" y="19" class="author">${sanitizeText(user.name)}</text>
                    </g>

                    <!-- Bottom Stats -->
                    <g transform="translate(0, 105)">
                         <text class="stats">❤️ ${public_reactions_count} Reactions  •  ${reading_time_minutes} min read</text>
                         <text x="420" y="0" text-anchor="end" class="tags">${sanitizeText(tagsString)}</text>
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
        // Return a generic error SVG
        const errorSvg = `
            <svg width="450" height="250" viewBox="0 0 450 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <rect x="0.5" y="0.5" width="449" height="249" rx="8" fill="white" stroke="#e5e7eb"/>
                 <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16px" fill="#ef4444">
                    Could not generate Dev.to card.
                 </text>
            </svg>
        `;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(500).send(errorSvg);
    }
};
