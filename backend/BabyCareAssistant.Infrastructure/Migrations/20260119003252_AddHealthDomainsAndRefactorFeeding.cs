using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BabyCareAssistant.Infrastructure.Migrations
{
    
    public partial class AddHealthDomainsAndRefactorFeeding : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "DurationMinutes",
                table: "FeedingLogs",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "FeedingLogs",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "FeedingLogs",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Babies",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Babies",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "ExcretionLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BabyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExcretionLogs", x => x.Id);
                    table.CheckConstraint("CK_ExcretionLogs_Type", "\"Type\" IN ('Wet', 'Dirty', 'Mixed')");
                    table.ForeignKey(
                        name: "FK_ExcretionLogs_Babies_BabyId",
                        column: x => x.BabyId,
                        principalTable: "Babies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrowthLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DateMeasured = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    WeightKg = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    HeightCm = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    HeadCircumferenceCm = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    BabyId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrowthLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GrowthLogs_Babies_BabyId",
                        column: x => x.BabyId,
                        principalTable: "Babies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VaccineCatalog",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DueAtMonths = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccineCatalog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VaccinationRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BabyId = table.Column<Guid>(type: "uuid", nullable: false),
                    VaccineCatalogId = table.Column<Guid>(type: "uuid", nullable: false),
                    AdministeredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccinationRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccinationRecords_Babies_BabyId",
                        column: x => x.BabyId,
                        principalTable: "Babies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VaccinationRecords_VaccineCatalog_VaccineCatalogId",
                        column: x => x.VaccineCatalogId,
                        principalTable: "VaccineCatalog",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.AddCheckConstraint(
                name: "CK_FeedingLogs_Type",
                table: "FeedingLogs",
                sql: "\"Type\" IN ('Bottle', 'Breast', 'Solids')");

            migrationBuilder.CreateIndex(
                name: "IX_ExcretionLogs_BabyId",
                table: "ExcretionLogs",
                column: "BabyId");

            migrationBuilder.CreateIndex(
                name: "IX_GrowthLogs_BabyId",
                table: "GrowthLogs",
                column: "BabyId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationRecords_BabyId",
                table: "VaccinationRecords",
                column: "BabyId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationRecords_VaccineCatalogId",
                table: "VaccinationRecords",
                column: "VaccineCatalogId");
        }

        
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExcretionLogs");

            migrationBuilder.DropTable(
                name: "GrowthLogs");

            migrationBuilder.DropTable(
                name: "VaccinationRecords");

            migrationBuilder.DropTable(
                name: "VaccineCatalog");

            migrationBuilder.DropCheckConstraint(
                name: "CK_FeedingLogs_Type",
                table: "FeedingLogs");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "FeedingLogs");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "FeedingLogs");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Babies");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Babies");

            migrationBuilder.AlterColumn<int>(
                name: "DurationMinutes",
                table: "FeedingLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
