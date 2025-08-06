using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _repository;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskRepository repository, ILogger<TasksController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
        {
            try
            {
                var tasks = await _repository.GetAllTasksAsync();
                var taskDtos = tasks.Select(MapToDto);
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Abrufen der Tasks");
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // GET: api/tasks/5
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

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto createTaskDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(createTaskDto.Title))
                {
                    return BadRequest("Der Titel darf nicht leer sein");
                }

                var task = new TaskItem
                {
                    Title = createTaskDto.Title,
                    Description = createTaskDto.Description,
                    Priority = createTaskDto.Priority,
                    IsCompleted = false
                };

                var createdTask = await _repository.CreateTaskAsync(task);
                var taskDto = MapToDto(createdTask);

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

        // PUT: api/tasks/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, UpdateTaskDto updateTaskDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(updateTaskDto.Title))
                {
                    return BadRequest("Der Titel darf nicht leer sein");
                }

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

        // DELETE: api/tasks/5
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
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fehler beim Löschen des Tasks mit ID {Id}", id);
                return StatusCode(500, "Ein interner Serverfehler ist aufgetreten");
            }
        }

        // GET: api/tasks/status/completed
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