using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ParkNews.Migrations
{
    /// <inheritdoc />
    public partial class SeedCategoryData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name", "ParentCategoryId", "Slug" },
                values: new object[,]
                {
                    { 1, "Tin tức thời sự trong nước và quốc tế", "Thời sự", null, "thoi-su" },
                    { 2, "Tin tức kinh tế, tài chính, thị trường", "Kinh tế", null, "kinh-te" },
                    { 3, "Tin tức thể thao trong nước và quốc tế", "Thể thao", null, "the-thao" },
                    { 4, "Tin tức giáo dục, học đường", "Giáo dục", null, "giao-duc" },
                    { 5, "Tin tức công nghệ, khoa học", "Công nghệ", null, "cong-nghe" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
