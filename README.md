# MotionMind AI

An AI-powered lesson planning system built with .NET.

## Features

- AI-generated lesson plans using Google's Gemini API
- RESTful API for lesson plan management
- Clean architecture with separated concerns (API, Core, Infrastructure)

## Getting Started

### Prerequisites

- .NET 8.0 or later
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository
2. Navigate to the MotionMind.Api directory
3. Run the application:
   ```bash
   dotnet run
   ```

### API Endpoints

- `POST /api/lessonplan/generate` - Generate a new lesson plan
- `GET /api/lessonplan` - Get all lesson plans

## Project Structure

- **MotionMind.Api** - Web API project
- **MotionMind.Core** - Domain entities and interfaces
- **MotionMind.Infrastructure** - Data access and external services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.