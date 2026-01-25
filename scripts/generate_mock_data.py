import uuid
from datetime import datetime, timedelta
import random

# CONFIGURATION
# IMPORTANT: Replace this with a valid BabyId from your database
BABY_ID = "71afb9e5-8f7d-41cd-a9ed-6fe3a3bbecbf"
DAYS_TO_GENERATE = (
    30  # Generate data for the last 30 days to get > 200 records (30 * ~7.5 = ~225)
)

# SQL Output File
OUTPUT_FILE = "mock_growth_logs.sql"


def generate_sql():
    sql_statements = []

    # Generate for the last 8 months (~240 days) to ensure > 200 records
    DAYS_BACK = 240
    start_date = datetime.now() - timedelta(days=DAYS_BACK)

    current_date = start_date
    records = []

    # Base metrics for a ~3 month old (starting point)
    current_weight = 3.5
    current_height = 50.0
    current_head = 34.0

    sql_statements = []

    for _ in range(DAYS_BACK):
        # Increment growth slightly each day
        # Weight: ~20-30g per day
        current_weight += random.uniform(0.015, 0.035)

        # Height: ~0.1cm per day (approx 3cm/month)
        current_height += random.uniform(0.08, 0.12)

        # Head: ~0.05cm per day (approx 1.5cm/month)
        current_head += random.uniform(0.03, 0.07)

        # Determine fields to include
        # "1 record per month with all... 1 record per day only with weight"
        # We'll treat the 1st of the month as the "Monthly Checkup"
        is_monthly_checkup = current_date.day == 1

        record_id = uuid.uuid4()

        # Add some random time to the date (between 8 AM and 8 PM)
        hour = random.randint(8, 20)
        minute = random.randint(0, 59)
        measured_at = current_date.replace(
            hour=hour, minute=minute, second=0, microsecond=0
        )

        timestamp = measured_at.isoformat()

        if is_monthly_checkup:
            # Full Record
            val_height = f"{current_height:.2f}"
            val_head = f"{current_head:.2f}"
        else:
            # Weight Only
            val_height = "NULL"
            val_head = "NULL"

        # Format for PostgreSQL
        sql = f"""INSERT INTO "GrowthLogs" ("Id", "DateMeasured", "WeightKg", "HeightCm", "HeadCircumferenceCm", "BabyId", "CreatedAt", "UpdatedAt") VALUES ('{record_id}', '{timestamp}', {current_weight:.2f}, {val_height}, {val_head}, '{BABY_ID}', '{timestamp}', '{timestamp}');"""
        sql_statements.append(sql)

        current_date += timedelta(days=1)

    with open(OUTPUT_FILE, "w") as f:
        f.write("-- Mock Data for GrowthLogs table\n")
        f.write(f"-- BabyId: {BABY_ID}\n")
        f.write("\n".join(sql_statements))

    print(f"Generated {len(sql_statements)} records to {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_sql()
