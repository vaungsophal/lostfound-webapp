using MongoDB.Driver;
using api.Models;

namespace api.Services;

public class ItemService
{
    private readonly IMongoCollection<Item> _items;

    public ItemService(IMongoDatabase database)
    {
        _items = database.GetCollection<Item>("items");
    }

    public List<Item> GetAllItems()
    {
        return _items.Find(item => true).SortByDescending(item => item.CreatedAt).ToList();
    }

    public Item? GetItemById(string id)
    {
        return _items.Find(item => item.Id == id).FirstOrDefault();
    }

    public List<Item> GetItemsByType(string type)
    {
        return _items.Find(item => item.Type == type).SortByDescending(item => item.CreatedAt).ToList();
    }

    public Item CreateItem(Item item)
    {
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _items.InsertOne(item);
        return item;
    }

    public Item? UpdateItem(string id, Item item)
    {
        item.UpdatedAt = DateTime.UtcNow;
        var result = _items.ReplaceOne(item => item.Id == id, item);
        return result.ModifiedCount > 0 ? item : null;
    }

    public bool DeleteItem(string id)
    {
        var result = _items.DeleteOne(item => item.Id == id);
        return result.DeletedCount > 0;
    }
}
