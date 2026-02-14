using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BabyCareAssistant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixMissingColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"FeedingLogs\" ADD COLUMN IF NOT EXISTS \"DurationMinutes\" integer;");
            migrationBuilder.Sql("ALTER TABLE \"FeedingLogs\" ADD COLUMN IF NOT EXISTS \"LeftBreastDurationMinutes\" integer;");
            migrationBuilder.Sql("ALTER TABLE \"FeedingLogs\" ADD COLUMN IF NOT EXISTS \"RightBreastDurationMinutes\" integer;");
            migrationBuilder.Sql("ALTER TABLE \"FeedingLogs\" ADD COLUMN IF NOT EXISTS \"Note\" text;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
