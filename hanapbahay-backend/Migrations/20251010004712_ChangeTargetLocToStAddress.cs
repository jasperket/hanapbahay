using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hanapbahay_backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTargetLocToStAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TargetLocation",
                table: "Properties",
                newName: "StreetAddress");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StreetAddress",
                table: "Properties",
                newName: "TargetLocation");
        }
    }
}
