using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.IO;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        try
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");

            await using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            await using var cmd = new NpgsqlCommand("SELECT * FROM stores", connection);
            await using var reader = await cmd.ExecuteReaderAsync();
            string header = string.Format("{0}, {1}, {2}\n", "id", "storename", "address");

            File.WriteAllText("./file.csv", header.ToString());
            while (await reader.ReadAsync())
            {
                string csv = string.Format("{0}, {1}, {2}\n", reader["id"], reader["storename"], reader["address"]);
                File.AppendAllText("./file.csv", csv.ToString());
                Console.WriteLine(reader["storename"]); // replace with your actual column
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database error: {ex.Message}");
        }
    }
}
