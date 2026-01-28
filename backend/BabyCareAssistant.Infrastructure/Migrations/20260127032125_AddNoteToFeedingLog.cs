using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BabyCareAssistant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteToFeedingLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "FeedingLogs",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "FeedingLogs");
        }
    }
}
