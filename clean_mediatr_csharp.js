const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

const featuresDir = path.join(__dirname, 'backend', 'BabyCareAssistant.Application', 'Features');

walkDir(featuresDir, function(filePath) {
    if (!filePath.endsWith('.cs')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove MediatR using statements
    content = content.replace(/using MediatR;\r?\n/g, '');

    // Safely remove : IRequest<T> and : IRequest from records on the same line
    content = content.replace(/(\s*):\s*IRequest<[^>]+>(\s*;)/g, '$2');
    content = content.replace(/(\s*):\s*IRequest(\s*;)/g, '$2');

    // Safely remove : IRequestHandler<T, R> that may span multiple lines before an opening brace.
    // We look for : IRequestHandler<...> and replace it with empty space, preserving newlines
    content = content.replace(/(\s*):\s*IRequestHandler<[^>]+>(\s*\{)/g, '$2');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
