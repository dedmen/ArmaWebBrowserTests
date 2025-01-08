using System;
using System.IO;
using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;

namespace BuildTaskLibrary
{
    public class ArmaPublishTask : Microsoft.Build.Utilities.Task
    {
        public string PublishTargetDir { get; set; }

        public override bool Execute()
        {
            //System.Diagnostics.Debugger.Launch();
            ForEachFileInDirectory(PublishTargetDir, file =>
            {
                if (file.EndsWith(".wasm.gz"))
                {
                    // create a .b64 variant
                    File.WriteAllText($"{file.Replace(".wasm.gz", ".wasm")}.b64",Convert.ToBase64String(File.ReadAllBytes(file)));
                }

                if (!file.Contains("Debug"))
                {
                    // Delete files we don't need
                    if (file.EndsWith(".wasm")) File.Delete(file);
                    if (file.EndsWith(".wasm.br")) File.Delete(file);
                    if (file.EndsWith(".wasm.gz")) File.Delete(file);
                    if (file.EndsWith(".js.br")) File.Delete(file);
                    if (file.EndsWith(".js.gz")) File.Delete(file);
                    if (file.EndsWith(".json.br")) File.Delete(file);
                    if (file.EndsWith(".json.gz")) File.Delete(file);
                }
            });

            return true;
        }



        public void ForEachFileInDirectory(string directory, Action<string> func)
        {
            try
            {
                Console.WriteLine(directory);

                foreach (string f in Directory.GetFiles(directory))
                {
                    func(f);
                }

                foreach (string d in Directory.GetDirectories(directory))
                {
                    ForEachFileInDirectory(d, func);
                }
            }
            catch (System.Exception excpt)
            {
                Log.LogError(excpt.Message);
            }
        }
    }
}
