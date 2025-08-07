using TaskManagerAPI.Models;

namespace TaskManagerAPI.DTOs
{
    // data transfer object - das schicke ich ans frontend zurück
    // hat alle felder vom model aber ist unabhängig davon
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; } // kann null sein
        public Priority Priority { get; set; }
    }

    // dto für neue tasks - hat keine id weil die wird von der db generiert
    // hat auch keine timestamps weil die setze ich im repository
    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Priority Priority { get; set; } // default ist 0 = Low
    }

    // dto für task updates - kann alle felder ändern
    // id kommt über die url parameter
    public class UpdateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public Priority Priority { get; set; }
    }
}