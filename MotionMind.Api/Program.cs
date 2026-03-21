using Microsoft.EntityFrameworkCore;
using MotionMind.Core.Interfaces;
using MotionMind.Infrastructure.Data;
using MotionMind.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ─────────────────────────────────────────────────────────────────

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core — PostgreSQL
// Connection string from appsettings.json or env var:  ConnectionStrings__DefaultConnection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
