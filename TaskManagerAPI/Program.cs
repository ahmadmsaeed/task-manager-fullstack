using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Services für dependency injection container registrieren
builder.Services.AddControllers(); // mvc controller support
builder.Services.AddEndpointsApiExplorer(); // für swagger dokumentation
builder.Services.AddSwaggerGen(); // swagger ui für api testing

// Datenbank-Context mit sqlite konfigurieren
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=taskmanager.db")); // fallback connection string

// Repository pattern für dependency injection registrieren
// scoped = eine instanz pro http request
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// CORS policy für angular frontend auf port 4200
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") // nur angular dev server erlauben
                  .AllowAnyHeader() // alle http headers erlauben
                  .AllowAnyMethod(); // GET, POST, PUT, DELETE etc.
        });
});

var app = builder.Build();

// beim app start datenbank erstellen falls sie nicht existiert
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated(); // erstellt db und führt migrations aus
}

// HTTP Request Pipeline konfigurieren - reihenfolge ist wichtig!
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // swagger json endpoint
    app.UseSwaggerUI(); // swagger ui auf /swagger
}

app.UseHttpsRedirection(); // http requests zu https umleiten
app.UseCors("AllowAngular"); // cors policy aktivieren
app.UseAuthorization(); // auth middleware (aktuell nicht genutzt)
app.MapControllers(); // controller routing aktivieren

app.Run(); // server starten