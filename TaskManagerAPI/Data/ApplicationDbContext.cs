using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //seed daten für initiale tasks
            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    Id = 1,
                    Title = "Erste Aufgabe",
                    Description = "Dies ist ein Beispielaufgabe.",
                    IsCompleted = false,
                    CreatedAt = new DateTime(2025, 8, 6, 10, 0, 0), // Fixed date instead of DateTime.Now
                    Priority = Priority.Medium
                },
                new TaskItem
                {
                    Id = 2,
                    Title = "Zweite Aufgabe",
                    Description = "Dies ist eine weitere Beispielaufgabe.",
                    IsCompleted = false,
                    CreatedAt = new DateTime(2025, 8, 6, 10, 30, 0), // Fixed date instead of DateTime.Now
                    Priority = Priority.High
                }
            );
        }
    }
}