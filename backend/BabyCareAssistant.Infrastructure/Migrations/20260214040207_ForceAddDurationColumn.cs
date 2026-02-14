using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BabyCareAssistant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ForceAddDurationColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"FeedingLogs\" DROP COLUMN IF EXISTS \"DurationMinutes\";");
            migrationBuilder.Sql("ALTER TABLE \"FeedingLogs\" ADD COLUMN \"DurationMinutes\" integer;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
