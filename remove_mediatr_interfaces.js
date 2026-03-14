const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const featuresDir = path.join(__dirname, 'backend', 'BabyCareAssistant.Application', 'Features');

walkDir(featuresDir, function(filePath) {
    if (!filePath.endsWith('.cs')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove MediatR using statements
    content = content.replace(/using MediatR;\s*/g, '');

    // Remove : IRequest<T> from records and classes
    content = content.replace(/:\s*IRequest<[^>]+>\s*(,?)/g, (match, trailingComma) => {
        return trailingComma ? ':' : '';
    });
    // Remove : IRequest from records and classes
    content = content.replace(/:\s*IRequest\s*(,?)/g, (match, trailingComma) => {
        return trailingComma ? ':' : '';
    });
    
    // Clean up trailing commas or colons if they were left behind by the removal
    content = content.replace(/:\s*\{/g, '{');
    content = content.replace(/,\s*\{/g, '{');
    
    // Remove IRequestHandler definitions
    content = content.replace(/:\s*IRequestHandler<[^>]+>\s*\{/g, '{');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
