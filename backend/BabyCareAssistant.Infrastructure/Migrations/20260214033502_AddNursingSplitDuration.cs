using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BabyCareAssistant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNursingSplitDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LeftBreastDurationMinutes",
                table: "FeedingLogs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RightBreastDurationMinutes",
                table: "FeedingLogs",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LeftBreastDurationMinutes",
                table: "FeedingLogs");

            migrationBuilder.DropColumn(
                name: "RightBreastDurationMinutes",
                table: "FeedingLogs");
        }
    }
}
