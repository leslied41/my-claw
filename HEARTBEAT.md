# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

## Job Pipeline Check

Check `workspace/jobs/JOB_PIPELINE.md` for:
1. Any jobs in `pending_review` status older than 48 hours → send one WhatsApp reminder (once only per job — track sent reminders in `workspace/memory/heartbeat-state.json`)
2. Any jobs in `pending_review` status older than 7 days → auto-skip them (move to Archived with reason `auto-skipped: no response after 7 days`)

Do not notify about jobs that were already reminded. Do not send reminders between 23:00–08:00 AEST.
