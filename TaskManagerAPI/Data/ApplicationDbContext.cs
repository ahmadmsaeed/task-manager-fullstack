using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data
{
    // entity framework dbcontext - verbindung zur datenbank
    // hier definiere ich welche tabellen es gibt und wie sie aussehen
    public class ApplicationDbContext : DbContext
    {
        // dependency injection constructor - bekomme connection string automatisch
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        // dbset für tasks tabelle - entity framework macht daraus automatisch ne tabelle
        public DbSet<TaskItem> Tasks { get; set; }

        // hier konfiguriere ich das datenbank model
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // seed daten für initiale tasks - wird bei erster migration eingefügt
            // nutze feste datum statt DateTime.Now damit migrations konsistent sind
            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    Id = 1,
                    Title = "Erste Aufgabe",
                    Description = "Dies ist ein Beispielaufgabe.",
                    IsCompleted = false,
                    CreatedAt = new DateTime(2025, 8, 6, 10, 0, 0), // festes datum für migrations
                    Priority = Priority.Medium
                },
                new TaskItem
                {
                    Id = 2,
                    Title = "Zweite Aufgabe",
                    Description = "Dies ist eine weitere Beispielaufgabe.",
                    IsCompleted = false,
                    CreatedAt = new DateTime(2025, 8, 6, 10, 30, 0), // festes datum für migrations
                    Priority = Priority.High
                }
            );
        }
    }
}