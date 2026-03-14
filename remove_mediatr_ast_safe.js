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

    content = content.replace(/using MediatR;\s*/g, '');

    // Replace : IRequest<T> and : IRequest
    // Match the exact record definition ending and strip the inheritance part
    content = content.replace(/public record ([A-Za-z0-9_]+)\(([^)]*)\)\s*:\s*IRequest(?:<[^>]+>)?\s*;/g, 'public record $1($2);');
    
    // Replace struct records without parameters
    content = content.replace(/public record ([A-Za-z0-9_]+)\s*:\s*IRequest(?:<[^>]+>)?\s*;/g, 'public record $1;');

    // Safely remove : IRequestHandler<T, R> which might span lines before the { bracket
    // This looks for "class Name(...) : IRequestHandler<..., ...>"
    // or    ": IRequestHandler<..., ...>" 
    // And replaces it with just nothing if on a new line, or removes the colon.
    content = content.replace(/:\s*IRequestHandler<[^>]+>/g, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
