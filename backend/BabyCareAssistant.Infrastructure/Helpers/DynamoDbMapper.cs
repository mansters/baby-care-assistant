using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BabyCareAssistant.Infrastructure.Helpers;

public static class DynamoDbMapper
{
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = null, // 保持大写原样
        Converters = { new JsonStringEnumConverter() },
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    // 把 DynamoDB 的响应转成 C# 实体
    public static T? ToEntity<T>(Dictionary<string, AttributeValue>? item) where T : class
    {
        if (item == null || item.Count == 0) return null;
        var doc = Document.FromAttributeMap(item);
        var json = doc.ToJson();
        return JsonSerializer.Deserialize<T>(json, Options);
    }

    // 把 C# 实体转成 DynamoDB 能认的 Dictionary
    public static Dictionary<string, AttributeValue> ToAttributeMap<T>(T entity) where T : class
    {
        var json = JsonSerializer.Serialize(entity, Options);
        var doc = Document.FromJson(json);
        return doc.ToAttributeMap();
    }
}