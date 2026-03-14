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

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Remove : IRequest<T> and : IRequest
        if (line.includes('IRequest<') || line.includes('IRequest')) {
            line = line.replace(/:\s*IRequest<[^>]+>/, '');
            line = line.replace(/:\s*IRequest/, '');
        }

        // Remove : IRequestHandler<T, R>
        if (line.includes('IRequestHandler<')) {
            line = line.replace(/:\s*IRequestHandler<[^>]+>/, '');
        }

        // Cleanup trailing spaces or orphaned colons
        line = line.trimEnd();
        if (line.endsWith(':')) {
            line = line.substring(0, line.length - 1).trimEnd();
        }

        lines[i] = line;
    }

    content = lines.join('\n');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
});
