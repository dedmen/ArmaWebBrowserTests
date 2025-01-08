
Build the Visual Studio project in Release mode, and Publish it.
Take the published files inside wwwroot folder, and copy them into the Mission files, such that indexArma.html is next to init.sqf.
Run the Mission and have fun.

If you develop, built Debug. Run it in the "http" configuration.
In game use the OpenDevelopmentVersion action.
That will load from the web server running in Visual studio.
Then you can use hot reload. To use hot reload you seem to need to press the button manually.
And the site doesn't auto refresh, you need to do something that changes the site, like pressing the button on the Counter page.
I don't know why it doesn't live refresh without interaction.

Keep in mind that loading files from inside Arma, only works in offline mode


There are several difficulties involved here.

For one, Blazor WebAssembly is built to work on a WebServer, with a real URL. Not inside a browser.
For that we needed to implement some tricks into indexArma.html.

The dotnet javascript would fail on our URLs.
It assembles the URL of the module it wants to load by doing baseURL/moduleName.
But our baseURL normally would be a "blob:..." url, which is not a valid start of a URL so javascript throws an exception. That's why we set a fake base URL using the <base> tag.

It then uses that assembled URL to do an import.
import is made to make web requests, which we cannot do here. So we manually do text replacements in the javascript, to redirect imports to our own wrapper which will fetch the files via Arma API.
But then, the imported modules javascript code, uses the "import.meta.url" to find out what URL it was loaded from, which again, would be the blob URL, which is again used to assemble new URLs and throws the same exception as above.
So our import wrapper will set a fake meta.url too.

Next problem, .wasm files are binary files. And the Arma API can only read text files. The files have NULL characters in them.
So to make that work, we first need to offline (during build time), convert the .wasm files into base64. So that we can convert them back to binary in our script after loading them from the game into the browser.

To do this base64 encoding "Task", I implemented a MSBuild Task (https://learn.microsoft.com/de-de/previous-versions/visualstudio/visual-studio-2015/msbuild/task-writing) inside the BuildTaskLibrary project.
Its triggered by BlazorArmaTest.csproj
Notably! We b64 encode the gzip compressed variants of the wasm files, that way we save storage and transfer size (from game to browser). It comfortably halves the size of our wasm files.
The task runs the Release version of BuildTaskLibrary, so if you want to run Debug, make sure to build that one in Release first.

Also note, We do this https://github.com/dotnet/runtime/blob/main/docs/design/features/globalization-invariant-mode.md so I don't need to b64 encode the globlaization dat file.



Because it is easier for me, I also made that task delete the files we don't need and also moved indexArma.html to index.html.
Due to that, and the hacks inside index.html, the published project CANNOT run inside a normal browser.

The build task only runs on publish, so non-published direct "Press Run inside Visual Studio" builds, have all the files for in-browser testing be present.
You can test index.html inside a browser, but indexArma.html is the one that will run in the game environment.


Our indexArma.html tweaks, redirect all "arma://" URL's into the game and also sets it as base URL.
That means, you can also load files from a PBO directly in your C# code, take a look at the Weather example.
If you are putting your files into a mod or a subfolder in a Mission, you need to adjust the <base> tag inside indexArma.html to match the path.

All relative URL's will be loaded from Arma.
You can also do `Http.GetStringAsync("/a3/ui_f/hpp/defineresincl.inc")` to load files from other mods. Note the leading slash


