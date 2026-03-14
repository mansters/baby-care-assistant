using System;
using System.IO;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CSharpInterfaceRemover
{
    class Program
    {
        static void Main(string[] args)
        {
            var featuresDir = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "..", "backend", "BabyCareAssistant.Application", "Features"));
            
            if (!Directory.Exists(featuresDir))
            {
                Console.WriteLine($"Directory not found: {featuresDir}");
                return;
            }

            var files = Directory.GetFiles(featuresDir, "*.cs", SearchOption.AllDirectories);
            int processed = 0;

            foreach (var file in files)
            {
                var code = File.ReadAllText(file);
                var tree = CSharpSyntaxTree.ParseText(code);
                var root = tree.GetRoot();

                // Remove 'using MediatR;'
                var newRoot = root.ReplaceNodes(root.DescendantNodes().OfType<UsingDirectiveSyntax>(), (originalNode, rewrittenNode) =>
                {
                    if (originalNode.Name?.ToString() == "MediatR")
                    {
                        return null; 
                    }
                    return rewrittenNode;
                });

                var usingToRemove = newRoot.DescendantNodes().OfType<UsingDirectiveSyntax>().FirstOrDefault(u => u.Name?.ToString() == "MediatR");
                if (usingToRemove != null)
                {
                    newRoot = newRoot.RemoveNode(usingToRemove, SyntaxRemoveOptions.KeepNoTrivia);
                }

                var rewriter = new MediatRRewriter();
                if (newRoot != null) {
                    var rewrittenRoot = rewriter.Visit(newRoot);

                    if (rewrittenRoot != root)
                    {
                        File.WriteAllText(file, rewrittenRoot.ToFullString());
                        processed++;
                    }
                }
            }

            Console.WriteLine($"Processed {processed} files.");
        }
    }

    class MediatRRewriter : CSharpSyntaxRewriter
    {
        public override SyntaxNode VisitBaseList(BaseListSyntax node)
        {
            var newTypes = node.Types.Where(t => 
            {
                var typeString = t.Type.ToString();
                if (typeString == "IRequest" || 
                    typeString.StartsWith("IRequest<") || 
                    typeString.StartsWith("IRequestHandler<"))
                {
                    return false;
                }
                return true;
            }).ToList();

            if (newTypes.Count == 0)
            {
                return null;
            }
            
            if (newTypes.Count != node.Types.Count)
            {
                var newBaseList = SyntaxFactory.BaseList(SyntaxFactory.SeparatedList(newTypes));
                return newBaseList.WithTriviaFrom(node);
            }

            return base.VisitBaseList(node);
        }
    }
}
