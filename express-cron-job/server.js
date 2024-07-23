const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const path = require('path');
const cronParser = require('cron-parser');
const fs = require('fs');
const cronstrue = require('cronstrue');
const { createClient } = require('@supabase/supabase-js');
const yaml = require('yaml');

const app = express();
const port = 3000;

// Read YAML configuration
const file = fs.readFileSync('./config.yml', 'utf8');
const config = yaml.parse(file);

const SUPABASE_URL = config.supabase.url;
const SUPABASE_KEY = config.supabase.key;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let jobs = [];
let isGlobalJobRunning = false; // Global lock

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Function to get the list of scripts
function getScripts() {
  const scriptsDir = path.resolve(__dirname, 'scripts');
  return fs
    .readdirSync(scriptsDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.slice(0, -3));
}

// Middleware to check authentication
async function checkAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  const { data, error } = await supabase.auth.getUser(
    token.replace('Bearer ', '')
  );
  if (error || !data) {
    return res.status(401).send('Unauthorized');
  }
  req.user = data.user;
  next();
}

// Serve the main page
app.get('/', (req, res) => {
  const scripts = getScripts();
  res.render('index', {
    jobs,
    scripts,
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY,
  });
});

// Schedule a new job
app.post('/schedule', checkAuth, (req, res) => {
  let { cronTime, customCronTime, description, script } = req.body;

  if (cronTime === 'custom') {
    cronTime = customCronTime;
  }

  const scriptPath = path.resolve(__dirname, `./scripts/${script}.js`);
  const jobFunction = require(scriptPath);

  const job = cron.schedule(cronTime, () => {
    if (isGlobalJobRunning) {
      console.log(
        `Job skipped at ${cronTime}: ${description} (another job is still running)`
      );
      return;
    }
    isGlobalJobRunning = true;
    console.log(`Job running at ${cronTime}: ${description}`);
    jobFunction(() => {
      isGlobalJobRunning = false;
    });
  });

  jobs.push({ cronTime, description, script, job });
  res.redirect('/');
});

// Cancel a job
app.post('/cancel/:index', checkAuth, (req, res) => {
  const index = req.params.index;

  if (jobs[index]) {
    jobs[index].job.stop();
    jobs.splice(index, 1);
  }

  res.redirect('/');
});

// Provide a summary for a custom cron expression
app.get('/summary', (req, res) => {
  const { cronTime } = req.query;

  try {
    const description = cronstrue.toString(cronTime);
    res.json({ summary: description });
  } catch (err) {
    res.json({ summary: 'Invalid cron expression' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
