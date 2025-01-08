using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using System;

namespace BlazorArmaTest
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Main test");
 
            var builder = WebAssemblyHostBuilder.CreateDefault(args);

            Console.WriteLine("Main test1");
            builder.RootComponents.Add<App>("#app");
            Console.WriteLine("Main test2");
            builder.RootComponents.Add<HeadOutlet>("head::after");
            Console.WriteLine("Main test3");

            Console.WriteLine(builder.HostEnvironment.BaseAddress);
            foreach (var se in args)
            {
                Console.WriteLine(se);
            }

            builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

            await builder.Build().RunAsync();
        }
    }
}