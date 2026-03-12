const https = require('https');
const url = require('url');

function fetch(targetUrl) {
    return new Promise((resolve, reject) => {
        https.get(targetUrl, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function analyze() {
    try {
        const html = await fetch('https://stevieawards.com/');
        const linkRegex = /<link[^>]+rel=['"]stylesheet['"][^>]+href=['"]([^'"]+)['"][^>]*>/gi;
        let match;
        const cssLinks = [];
        while ((match = linkRegex.exec(html)) !== null) {
            if (match[1].includes('.css')) {
                cssLinks.push(match[1]);
            }
        }

        let allCss = '';
        for (const link of cssLinks) {
            const fullUrl = url.resolve('https://stevieawards.com/', link);
            console.log('Fetching CSS:', fullUrl);
            try {
                const css = await fetch(fullUrl);
                allCss += css + '\n';
            } catch (e) {
                console.error('Failed to fetch:', fullUrl, e.message);
            }
        }

        const hexes = allCss.match(/#[A-Fa-f0-9]{3,6}/g) || [];
        const counts = {};
        hexes.forEach(h => {
            // Normalize #333 to #333333
            let hex = h.toLowerCase();
            if (hex.length === 4) {
                hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
            }
            counts[hex] = (counts[hex] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        console.log('\nMost common colors in CSS:');
        sorted.slice(0, 15).forEach(([c, n]) => console.log(`${c}: ${n}`));

        const colorRules = allCss.match(/([.a-zA-Z0-9#\s\-,:]+)\{[^}]*(color|background-color)\s*:\s*(#[a-fA-F0-9]{3,6})[^}]*\}/g) || [];
        console.log('\nSample rules:');
        colorRules.filter(r => r.includes('background') || r.includes('header')).slice(0, 15).forEach(r => console.log(r.replace(/\s+/g, ' ').trim()));

    } catch (e) { console.error(e); }
}

analyze();
