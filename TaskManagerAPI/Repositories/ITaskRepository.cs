using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    // interface für repository pattern - hier definiere ich was mein repository können muss
    // macht testing einfacher und code besser testbar
    public interface ITaskRepository
    {
        // alle tasks aus der datenbank holen
        Task<IEnumerable<TaskItem>> GetAllTasksAsync();
        
        // einzelnen task über id finden - kann null sein wenn nicht gefunden
        Task<TaskItem?> GetTaskByIdAsync(int id);
        
        // neuen task speichern und zurückgeben
        Task<TaskItem> CreateTaskAsync(TaskItem task);
        
        // existierenden task updaten - null wenn task nicht existiert
        Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task);
        
        // task löschen - true wenn erfolgreich, false wenn nicht gefunden
        Task<bool> DeleteTaskAsync(int id);
        
        // tasks nach fertig/unfertig status filtern
        Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(bool isCompleted);
    }
}