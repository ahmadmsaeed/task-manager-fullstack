using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Controllers
{
    // das ist mein hauptcontroller der alle http requests für tasks abarbeitet
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        // hier bekomme ich repository und logger durch dependency injection
        private readonly ITaskRepository _repository;
        private readonly ILogger<TasksController> _logger;

        // constructor - das system gibt mir automatisch repository und logger
        public TasksController(ITaskRepository repository, ILogger<TasksController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // alle tasks holen - GET api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
        {
            try
            {
                var tasks = await _repository.GetAllTasksAsync();
                var taskDtos = tasks.Select(MapToDto); // models zu DTOs mappen
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Abrufen der Tasks");
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // einzelnen task holen - GET api/tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            try
            {
                var task = await _repository.GetTaskByIdAsync(id);
                if (task == null)
                {
                    return NotFound($"Task mit ID {id} wurde nicht gefunden");
                }
                return Ok(MapToDto(task));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Abrufen des Tasks mit ID {Id}", id);
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // neuen task erstellen - POST api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto createTaskDto)
        {
            try
            {
                // einfache validierung - titel muss da sein
                if (string.IsNullOrWhiteSpace(createTaskDto.Title))
                {
                    return BadRequest("Der Titel darf nicht leer sein");
                }

                // DTO zu model umwandeln
                var task = new TaskItem
                {
                    Title = createTaskDto.Title,
                    Description = createTaskDto.Description,
                    Priority = createTaskDto.Priority,
                    IsCompleted = false // neue tasks sind immer unfertig
                };

                var createdTask = await _repository.CreateTaskAsync(task);
                var taskDto = MapToDto(createdTask);

                // gibt 201 created zurück mit location header
                return CreatedAtAction(
                    nameof(GetTask),
                    new { id = taskDto.Id },
                    taskDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Erstellen eines neuen Tasks");
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // task updaten - PUT api/tasks/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, UpdateTaskDto updateTaskDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(updateTaskDto.Title))
                {
                    return BadRequest("Der Titel darf nicht leer sein");
                }

                // DTO zu model für repository
                var task = new TaskItem
                {
                    Title = updateTaskDto.Title,
                    Description = updateTaskDto.Description,
                    IsCompleted = updateTaskDto.IsCompleted,
                    Priority = updateTaskDto.Priority
                };

                var updatedTask = await _repository.UpdateTaskAsync(id, task);
                if (updatedTask == null)
                {
                    return NotFound($"Task mit ID {id} wurde nicht gefunden");
                }

                return Ok(MapToDto(updatedTask));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Aktualisieren des Tasks mit ID {Id}", id);
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // task löschen - DELETE api/tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var deleted = await _repository.DeleteTaskAsync(id);
                if (!deleted)
                {
                    return NotFound($"Task mit ID {id} wurde nicht gefunden");
                }
                return NoContent(); // 204 no content bei erfolgreichem delete
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Löschen des Tasks mit ID {Id}", id);
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // tasks nach status filtern - GET api/tasks/status/true
        [HttpGet("status/{isCompleted}")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByStatus(bool isCompleted)
        {
            try
            {
                var tasks = await _repository.GetTasksByStatusAsync(isCompleted);
                var taskDtos = tasks.Select(MapToDto);
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Abrufen der Tasks nach Status");
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // helper methode um model zu dto zu konvertieren
        // mache ich hier statt automapper weil das projekt klein ist
        private static TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt,
                Priority = task.Priority
            };
        }
    }
}