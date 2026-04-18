using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    // Translated comment.
    public partial class AddCoachIdToAthlete : Migration
    {
        // Translated comment.
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CoachId",
                table: "Athletes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        // Translated comment.
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoachId",
                table: "Athletes");
        }
    }
}
