namespace TaskManagerAPI.Models
{
    // hauptmodel für einen task in der datenbank
    // entity framework nutzt diese klasse um die tabelle zu erstellen
    public class TaskItem
    {
        // primary key - entity framework erkennt "Id" automatisch als pk
        public int Id { get; set; }
        
        // string.empty als default damit nie null kommt
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        // simple bool für fertig/nicht fertig
        public bool IsCompleted { get; set; }
        
        // wird beim erstellen gesetzt
        public DateTime CreatedAt { get; set; }
        
        // nullable - nur gesetzt wenn task fertig ist
        public DateTime? CompletedAt { get; set; }
        
        // enum für priorität - wird als int in db gespeichert
        public Priority Priority { get; set; }
    
    }
    
    // prioritäts enum - nutze ich um dropdown optionen zu begrenzen
    // wird als 0,1,2 in der db gespeichert aber als strings ans frontend gesendet
    public enum Priority
    {
        Low = 0,     // niedrige priorität
        Medium = 1,  // standard priorität
        High = 2     // hohe priorität
    }
}