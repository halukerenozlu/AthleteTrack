using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    // Translated comment.
    public partial class MakeTeamIdNullable : Migration
    {
        // Translated comment.
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Athletes_Teams_TeamId",
                table: "Athletes");

            migrationBuilder.AlterColumn<int>(
                name: "TeamId",
                table: "Athletes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Athletes_Teams_TeamId",
                table: "Athletes",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }

        // Translated comment.
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Athletes_Teams_TeamId",
                table: "Athletes");

            migrationBuilder.AlterColumn<int>(
                name: "TeamId",
                table: "Athletes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Athletes_Teams_TeamId",
                table: "Athletes",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
