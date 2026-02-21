using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models;

public class Item
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("type")]
    public string Type { get; set; } = string.Empty;

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty;

    [BsonElement("location")]
    public string Location { get; set; } = string.Empty;

    [BsonElement("date")]
    public DateTime Date { get; set; }

    [BsonElement("contactName")]
    public string ContactName { get; set; } = string.Empty;

    [BsonElement("contactPhone")]
    public string ContactPhone { get; set; } = string.Empty;

    [BsonElement("contactEmail")]
    public string ContactEmail { get; set; } = string.Empty;

    [BsonElement("imageUrl")]
    public string? ImageUrl { get; set; }

    [BsonElement("status")]
    public string Status { get; set; } = "open";

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
