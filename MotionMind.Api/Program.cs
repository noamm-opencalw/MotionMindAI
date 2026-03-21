using Microsoft.EntityFrameworkCore;
using MotionMind.Core.Interfaces;
using MotionMind.Infrastructure.Data;
using MotionMind.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ─────────────────────────────────────────────────────────────────

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database — SQLite for dev, PostgreSQL for prod
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlite("Data Source=motionmind.db"));
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
}

// Repositories
builder.Services.AddScoped<ILessonPlanRepository, LessonPlanRepository>();

// AI Generation
// Use GeminiAIGenerationService when Gemini:ApiKey is configured, otherwise fall back to Mock
// Railway/Render inject env var GEMINI__APIKEY (double underscore = nested config)
var geminiKey = builder.Configuration["Gemini:ApiKey"]
    ?? Environment.GetEnvironmentVariable("GEMINI__APIKEY");
if (!string.IsNullOrWhiteSpace(geminiKey))
{
    builder.Services.AddHttpClient<IAIGenerationService, GeminiAIGenerationService>();
}
else
{
    builder.Services.AddScoped<IAIGenerationService, MockAIGenerationService>();
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    await MotionMind.Api.DatabaseInitializer.InitializeAsync(scope.ServiceProvider);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
