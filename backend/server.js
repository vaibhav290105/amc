const app = require('./src/app');
const { scheduleReminders } = require('./src/utils/scheduler');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  scheduleReminders(); // Start scheduled jobs
});
