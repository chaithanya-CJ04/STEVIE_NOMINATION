const https = require('https');
https.get('https://stevieawards.com/', res => {
    let body = '';
    res.on('data', chunk => { body += chunk; });
    res.on('end', () => {
        const fs = require('fs');
        fs.writeFileSync('stevie.html', body);
        console.log('Saved to stevie.html');
    });
});
