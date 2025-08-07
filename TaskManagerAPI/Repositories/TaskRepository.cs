using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    // konkrete implementation vom repository interface
    // hier passiert die echte datenbankarbeit mit entity framework
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        // dependency injection - bekomme den dbcontext automatisch
        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // alle tasks holen, neueste zuerst sortiert
        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            return await _context.Tasks
                .OrderByDescending(t => t.CreatedAt) // neueste tasks oben
                .ToListAsync();
        }

        // einzelnen task über primary key suchen
        public async Task<TaskItem?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        // neuen task in db speichern
        public async Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            task.CreatedAt = DateTime.Now; // erstellzeit setzen
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync(); // änderungen in db schreiben
            return task;
        }

        // existierenden task updaten
        public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem task)
        {
            var existingTask = await _context.Tasks.FindAsync(id);
            if (existingTask == null)
                return null; // task nicht gefunden

            // einzelne felder updaten statt ganzes objekt zu ersetzen
            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.Priority = task.Priority;
            
            // completion zeit logik - datum setzen wenn task fertig wird
            if (!existingTask.IsCompleted && task.IsCompleted)
            {
                existingTask.CompletedAt = DateTime.Now;
            }
            else if (existingTask.IsCompleted && !task.IsCompleted)
            {
                existingTask.CompletedAt = null; // zurücksetzen wenn wieder unfertig
            }
            
            existingTask.IsCompleted = task.IsCompleted;

            await _context.SaveChangesAsync();
            return existingTask;
        }

        // task aus db löschen
        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return false; // task existiert nicht

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true; // erfolgreich gelöscht
        }

        // tasks nach erledigt/nicht erledigt filtern
        public async Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(bool isCompleted)
        {
            return await _context.Tasks
                .Where(t => t.IsCompleted == isCompleted) // filter nach status
                .OrderByDescending(t => t.CreatedAt) // neueste zuerst
                .ToListAsync();
        }
    }
}