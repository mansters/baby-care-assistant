const fs = require('fs');
const path = require('path');

const endpointsDir = path.join(__dirname, 'backend', 'BabyCareAssistant.API', 'Endpoints');
const files = fs.readdirSync(endpointsDir).filter(f => f.endsWith('.cs'));

for (const file of files) {
    const filePath = path.join(endpointsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove MediatR using
    content = content.replace(/using MediatR;\s*/g, '');

    // Replace ISender with specific handlers
    // MapGet
    content = content.replace(/group\.MapGet\("([^"]*)", (?:async )?\(([^)]*?)ISender sender\)\s*=>\s*\{\s*(var result =\s*)?await sender\.Send\((new\s+([A-Za-z0-9]+)\([^)]*\))\);\s*(return[^}]*)\}\)/g, 
        (match, route, prefixProps, resultAssign, sendCall, queryName) => {
            const handlerName = queryName + 'Handler';
            return `group.MapGet("${route}", async (${prefixProps}${handlerName} handler) =>\n        {\n            ${resultAssign ? resultAssign : ''}await handler.Handle(${sendCall}, default);\n            ${match.match(/return[^}]*/)[0]}})`;
        });
        
    // MapPost
    content = content.replace(/group\.MapPost\("([^"]*)", (?:async )?\(([^)]*?)ISender sender\)\s*=>\s*\{\s*(var result =\s*)?await sender\.Send\((new\s+([A-Za-z0-9]+)\([^)]*\))\);\s*(return[^}]*)\}\)/g, 
        (match, route, prefixProps, resultAssign, sendCall, commandName) => {
            const handlerName = commandName + 'Handler';
            return `group.MapPost("${route}", async (${prefixProps}${handlerName} handler) =>\n        {\n            ${resultAssign ? resultAssign : ''}await handler.Handle(${sendCall}, default);\n            ${match.match(/return[^}]*/)[0]}})`;
        });

    // MapPut
    content = content.replace(/group\.MapPut\("([^"]*)", (?:async )?\(([^)]*?)ISender sender\)\s*=>\s*\{\s*(var result =\s*)?await sender\.Send\((new\s+([A-Za-z0-9]+)\([^)]*\))\);\s*(return[^}]*)\}\)/g, 
        (match, route, prefixProps, resultAssign, sendCall, commandName) => {
            const handlerName = commandName + 'Handler';
            return `group.MapPut("${route}", async (${prefixProps}${handlerName} handler) =>\n        {\n            ${resultAssign ? resultAssign : ''}await handler.Handle(${sendCall}, default);\n            ${match.match(/return[^}]*/)[0]}})`;
        });

    // MapDelete
    content = content.replace(/group\.MapDelete\("([^"]*)", (?:async )?\(([^)]*?)ISender sender\)\s*=>\s*\{\s*(var result =\s*)?await sender\.Send\((new\s+([A-Za-z0-9]+)\([^)]*\))\);\s*(return[^}]*)\}\)/g, 
        (match, route, prefixProps, resultAssign, sendCall, commandName) => {
            const handlerName = commandName + 'Handler';
            return `group.MapDelete("${route}", async (${prefixProps}${handlerName} handler) =>\n        {\n            ${resultAssign ? resultAssign : ''}await handler.Handle(${sendCall}, default);\n            ${match.match(/return[^}]*/)[0]}})`;
        });
        
    fs.writeFileSync(filePath, content, 'utf8');
}
