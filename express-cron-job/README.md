# Cron Job Scheduler

A cron job scheduler with Supabase authentication. This project allows users to sign up, sign in, and manage cron jobs through a user-friendly interface.

## Features

- User authentication with Supabase
- Schedule cron jobs
- View and manage existing cron jobs
- Custom cron expression input with human-readable summaries

## Prerequisites

- Node.js (>=12.0.0)
- npm

## Getting Started

### 1. Clone the repository

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration

#### Supabase

1. Create a Supabase account and set up a new project.
2. Get your Supabase URL and API Key from the Supabase dashboard.

#### Configuration File

1. Create a copy of `config.template.yml` and rename it to `config.yml`:

```bash
cp config.template.yml config.yml
```

2. Open `config.yml` and add your Supabase URL and API Key:

```yaml
supabase:
  url: 'YOUR_SUPABASE_URL'
  key: 'YOUR_SUPABASE_KEY'
```

### 4. Start the server

```bash
npm start
```

### 5. Access the application

Open your web browser and go to `http://localhost:3000`.

## Project Structure

```
cron-job-scheduler/
│
├── scripts/
│   ├── script1.js
│   └── script2.js
│
├── views/
│   └── index.ejs
│
├── config.template.yml
├── config.yml
├── server.js
├── package.json
└── package-lock.json
```

## License

This project is licensed under the MIT License.

### `config.template.yml`

This is the template configuration file that developers need to rename and update with their Supabase details.

```yaml
supabase:
  url: 'YOUR_SUPABASE_URL'
  key: 'YOUR_SUPABASE_KEY'
```

### Adding `.gitignore` Entry for `config.yml`

Make sure `config.yml` is ignored in your `.gitignore` file:

```
# Local configuration
config.yml
```

### Summary

- The `README.md` provides a comprehensive guide to set up and run the project.
- `config.template.yml` is a template configuration file that developers will copy and rename to `config.yml`.
- The `.gitignore` file includes `config.yml` to ensure local configurations are not committed to the repository.
