# MotionMind AI

An AI-powered lesson planning system built with .NET that generates intelligent Pilates and Physical Education lesson plans using Google's Gemini AI.

## Features

- 🤖 AI-generated lesson plans using Google's Gemini Flash
- 📊 RESTful API for lesson plan management
- 🗄️ SQLite database for development, PostgreSQL for production
- 🏗️ Clean architecture with separated concerns (API, Core, Infrastructure)
- 🐳 Docker support for easy deployment
- 📚 Swagger/OpenAPI documentation

## Getting Started

### Prerequisites

- .NET 8.0 or later
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MotionMindAI.git
   cd MotionMindAI
   ```

2. **Install dependencies**
   ```bash
   dotnet restore
   ```

3. **Set up Gemini AI API Key**

   Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey), then:

   - Option A: Update `MotionMind.Api/appsettings.json`:
     ```json
     {
       "Gemini": {
         "ApiKey": "YOUR_API_KEY_HERE"
       }
     }
     ```

   - Option B: Set environment variable:
     ```bash
     export GEMINI__APIKEY=YOUR_API_KEY_HERE
     ```

4. **Run the application**
   ```bash
   cd MotionMind.Api
   dotnet run
   ```

5. **Access the API**
   - Swagger UI: http://localhost:5000/swagger
   - API Docs: http://localhost:5000/api-docs

### API Endpoints

- `POST /api/lessons/generate` - Generate a new AI lesson plan
- `GET /api/lessons` - Get all saved lesson plans
- `GET /api/lessons/{id}` - Get a specific lesson plan

#### Example Request

```bash
curl -X POST http://localhost:5000/api/lessons/generate \
  -H "Content-Type: application/json" \
  -d '{
    "targetAge": "Adults",
    "focusArea": "Core Strength",
    "durationMinutes": 45
  }'
```

## Deployment Options

### Option 1: GitHub Pages (Documentation Only)

Since this is a .NET API (not static HTML), you cannot deploy the full application to GitHub Pages. However, you can deploy the API documentation:

1. Go to your GitHub repository settings
2. Navigate to "Pages" in the sidebar
3. Set source to "Deploy from a branch"
4. Select "main" branch and "/docs" folder
5. Access your docs at: `https://YOUR_USERNAME.github.io/MotionMindAI/`

### Option 2: Railway (Recommended for .NET APIs)

Railway provides free tier for .NET applications:

1. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - Set `GEMINI__APIKEY` with your Gemini API key
   - Railway will auto-detect .NET and deploy

3. **Database Setup**
   - Railway provides PostgreSQL automatically
   - The app will use PostgreSQL in production

### Option 3: Azure/App Service

1. Create an Azure account
2. Create an App Service with .NET runtime
3. Deploy via GitHub Actions or Azure CLI
4. Configure environment variables for Gemini API key

### Option 4: Docker Deployment

```bash
# Build the image
docker build -t motionmind-ai .

# Run locally
docker run -p 8080:8080 -e GEMINI__APIKEY=your_key motionmind-ai

# Deploy to any container hosting service (Heroku, DigitalOcean, etc.)
```

## Project Structure

- **MotionMind.Api** - Web API project with controllers and configuration
- **MotionMind.Core** - Domain entities and business logic interfaces
- **MotionMind.Infrastructure** - Data access, AI services, and external integrations

## Development

### Running Tests

```bash
dotnet test
```

### Database Migrations

For production PostgreSQL:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure everything builds
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Google Gemini AI](https://ai.google.dev/)
- Built with [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)
- Database with [Entity Framework Core](https://docs.microsoft.com/en-us/ef/)