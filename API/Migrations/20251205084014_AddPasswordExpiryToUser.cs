using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    // Translated comment.
    public partial class AddPasswordExpiryToUser : Migration
    {
        // Translated comment.
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTemporaryPassword",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordExpiresAt",
                table: "Users",
                type: "datetime2",
                nullable: true);
        }

        // Translated comment.
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTemporaryPassword",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordExpiresAt",
                table: "Users");
        }
    }
}
