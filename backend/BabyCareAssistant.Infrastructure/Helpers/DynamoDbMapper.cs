using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BabyCareAssistant.Infrastructure.Helpers;

public static class DynamoDbMapper
{
    public static T? ToEntity<T>(Dictionary<string, AttributeValue>? item) where T : class
    {
        if (item == null || item.Count == 0) return null;
        var doc = Document.FromAttributeMap(item);
        var json = doc.ToJson();
        
        var typeInfo = DynamoDbJsonSerializerContext.Default.GetTypeInfo(typeof(T)) as System.Text.Json.Serialization.Metadata.JsonTypeInfo<T>;
        if (typeInfo == null)
        {
            return JsonSerializer.Deserialize<T>(json, DynamoDbJsonSerializerContext.Default.Options);
        }
        return JsonSerializer.Deserialize(json, typeInfo);
    }

    public static Dictionary<string, AttributeValue> ToAttributeMap<T>(T entity) where T : class
    {
        var typeInfo = DynamoDbJsonSerializerContext.Default.GetTypeInfo(typeof(T)) as System.Text.Json.Serialization.Metadata.JsonTypeInfo<T>;
        string json;
        if (typeInfo == null)
        {
            json = JsonSerializer.Serialize(entity, DynamoDbJsonSerializerContext.Default.Options);
        }
        else
        {
            json = JsonSerializer.Serialize(entity, typeInfo);
        }
        var doc = Document.FromJson(json);
        return doc.ToAttributeMap();
    }
}