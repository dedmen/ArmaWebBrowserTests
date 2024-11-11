export class A3API {
    private static pendingRequests: {[key:string]: any} = {};

    static _response(key: string, content: string)
    {
      console.log(`response ${key} =`, content);
      if (!(key in this.pendingRequests))
        return; // Request doesn't exist
  
      // Trigger all promises
      this.pendingRequests[key].forEach((e: any) => e.resolve(content));
      delete this.pendingRequests[key];
    }
  
    // texturePath does not being with \
    // texturePath cannot contain semicolon
    // maxSize is power of two
    // Promise will return a data url containing the texture/image
    static RequestTexture(texturePath: string, maxSize: number) : Promise<string>
    {
      return new Promise((resolve, reject) => {
        let key = `tex${texturePath};${maxSize}`;
        let waiterList = this.pendingRequests[key] = this.pendingRequests[key] || [];
        waiterList.push({resolve, reject});
  
        // Send request to Arma. __ prefix is reserved
        alert(`__A3TexReq;${texturePath};${maxSize}`);
      });
    }
  
    // filePath same as loadFile SQF command
    // filePath cannot contain semicolon
    // Promise will return the file contents as text
    static RequestFile(filePath: string) : Promise<string>
    {
      return new Promise((resolve, reject) => {
        let key = `file${filePath}`;
        let waiterList = this.pendingRequests[key] = this.pendingRequests[key] || [];
        waiterList.push({resolve, reject});
  
        // Send request to Arma. __ prefix is reserved
        alert(`__A3FileReq;${filePath}`);
      });
    }
  
    // filePath same as loadFile SQF command
    // filePath cannot contain semicolon
    // Promise will return the file contents as text
    static RequestPreprocessedFile(filePath: string) : Promise<string>
    {
      return new Promise((resolve, reject) => {
        let key = `fileP${filePath}`;
        let waiterList = this.pendingRequests[key] = this.pendingRequests[key] || [];
        waiterList.push({resolve, reject});
  
        // Send request to Arma. __ prefix is reserved
        alert(`__A3FilePReq;${filePath}`);
      });
    }

}
