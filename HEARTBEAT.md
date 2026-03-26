# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

## Job Pipeline Check

Check `workspace/jobs/JOB_PIPELINE.md` for:

**Expired active jobs:**
Seek listings are typically live for 30 days. Move to Archived with status `expired` if:
- `discovered`, `filtered`, `scored`, or `materials_ready` and added more than 30 days ago

No notification needed for expiry — just move them silently.

**Archived entry cleanup:**
Delete rows from the Archived table that are older than 60 days. These are fully dead — `weak_match`, `discarded`, `skipped`, `applied`, `expired`, `auto-skipped`. Keeps the pipeline file from growing indefinitely.

Also delete any application files in `workspace/jobs/applications/` whose corresponding pipeline entry has been deleted.
