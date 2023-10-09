export interface UTApiOptions {
  /**
   * Provide a custom fetch function.
   * @default globalThis.fetch
   */
  fetch?: any;
  /**
   * Provide a custom UploadThing API key.
   * @default process.env.UPLOADTHING_SECRET
   */
  apiKey?: string;
}

export class FixUTApi {
  private fetch: any;
  private apiKey: string | undefined;
  private defaultHeaders: Record<string, string>;

  constructor(opts?: UTApiOptions) {
    this.fetch = opts?.fetch ?? globalThis.fetch;
    this.apiKey = opts?.apiKey ?? process.env.UPLOADTHING_SECRET;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'x-uploadthing-api-key': this.apiKey!
      //'x-uploadthing-version': UPLOADTHING_VERSION
    };
  }

  private async requestUploadThing<T extends Record<string, unknown>>(pathname: `/${string}`, body: Record<string, unknown>, fallbackErrorMessage: string) {
    // Force API key to be set before requesting.
    // Ideally we'd just throw in the constructor but since we need to export
    // a `utapi` object we can't throw in the constructor because it would
    // be a breaking change.
    // FIXME: In next major
    //getApiKeyOrThrow();

    const res = await this.fetch(`https://uploadthing.com${pathname}`, {
      method: 'POST',
      cache: 'no-store',
      headers: this.defaultHeaders,
      body: JSON.stringify(body)
    });

    const json = await res.json();
    if (!res.ok || 'error' in json) {
      console.error('[UT] Error:', json);
    }

    return json;
  }

  /**
   * Request to delete files from UploadThing storage.
   * @param {string | string[]} fileKeys
   *
   * @example
   * await deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
   *
   * @example
   * await deleteFiles(["2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg","1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"])
   */
  async deleteFiles(fileKeys: string[] | string) {
    if (!Array.isArray(fileKeys)) fileKeys = [fileKeys];

    return this.requestUploadThing<{ success: boolean }>('/api/deleteFile', { fileKeys }, 'An unknown error occurred while deleting files.');
  }
}
