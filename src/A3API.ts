export class A3API {
  private static pendingRequests: { [key: string]: Array<{resolve: (_:string)=>void, reject: (_:any)=>void}> } = {};

  static _response(key: string, content: string) {
    if (!(key in this.pendingRequests)) return; // Request doesn't exist

    // Trigger all promises
    this.pendingRequests[key].forEach((e: any) => e.resolve(content));
    delete this.pendingRequests[key];
  }

  private static _push(key: string, d: {resolve: (_:string)=>void, reject: (_:any)=>void}) : boolean
  {
    const waiterList = (this.pendingRequests[key] = this.pendingRequests[key] || []);
    waiterList.push(d);
    return waiterList.length == 1; // First insert
  }

  /**
   * Loads file from game filesystem.
   *
   * @param filePath - Path in game filesystem, without leading backslash
   * @param maxSize - maximum texture width (used to select Mip)
   * @returns The image as a data-url
   */
  static RequestTexture(texturePath: string, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (A3API._push(`tex${texturePath};${maxSize}`, { resolve, reject })) // Only if new request, and not already queued
        A3API.SendAlert(`__A3TexReq;${texturePath};${maxSize}`);
    });
  }

  /**
   * Loads file from game filesystem.
   *
   * @param filePath - same as loadFile SQF command
   * @returns The file content
   */
  static RequestFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (A3API._push(`file${filePath}`, { resolve, reject }))
        A3API.SendAlert(`__A3FileReq;${filePath}`);
    });
  }

  /**
   * Loads and preprocesses file from game filesystem.
   *
   * @param filePath - same as preprocessFile SQF command
   * @returns The file content
   */
  static RequestPreprocessedFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (A3API._push(`fileP${filePath}`, { resolve, reject }))
        A3API.SendAlert(`__A3FilePReq;${filePath}`);
    });
  }

  // Triggers a alert() (Needs to be piped due to https://chromestatus.com/feature/5148698084376576)
  static SendAlert(content: string): void {
    window.parent.postMessage({ alert: content }, '*');
  }
  
  static SendConfirm(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (A3API._push(`confirm`, { resolve, reject }))
        window.parent.postMessage({ confirm: content }, '*');
    });
  }
}
