import { ClientFileService } from "./fileService";
import { subscribe } from "node:diagnostics_channel";

export const USER_AGENT = "depthbomb/node-catbox" as const;
export const CATBOX_API_ENDPOINT = "https://catbox.moe/user/api.php" as const;
export const LITTERBOX_API_ENDPOINT =
  "https://litterbox.catbox.moe/resources/internals/api.php" as const;

type Channel = {
  hasSubscribers: boolean;
  publish: (data: any) => void;
  subscribe: (callback: (data: any) => void) => void;
};

function createChannel(): Channel {
  const subscribers: ((data: any) => void)[] = [];
  const channel = {
    hasSubscribers: false,
    publish: (data: any) => subscribers.forEach((cb) => cb(data)),
    subscribe: (callback: (data: any) => void) => {
      subscribers.push(callback);
      // Update hasSubscribers when a subscriber is added
      channel.hasSubscribers = subscribers.length > 0;
    },
  };
  return channel;
}
export const kCatboxRequestCreate = Symbol("catbox:request:create");
export const kLitterboxRequestCreate = Symbol("litterbox:request:create");

export const catboxChannels = {
  create: createChannel(),
};

export const litterboxChannels = {
  create: createChannel(),
};

// Rest of the code remains the same, but remove this part:
// subscribe(kCatboxRequestCreate, (data: any) => {
//   const request: RequestInit = data.request;
//   console.log(request);
// });

// // Instead, use your custom channel:
// litterboxChannels.create.subscribe((data: any) => {
//   const request: RequestInit = data.request;
//   console.log(request);
// });

type UploadOptions = {
  /**
   * Path to the file to upload
   */
  path: string;
  /**
   * Duration before the file is deleted, defaults to `1h`
   */
  duration?: "1h" | "12h" | "24h" | "72h" | (string & {});
};

export class Litterbox {
  public async upload(options: UploadOptions): Promise<string> {
    let { path, duration } = options;

    console.log("uploadFile CATBOX", options);
    if (duration) {
      const acceptedDurations = ["1h", "12h", "24h", "72h"];
      if (!acceptedDurations.includes(duration)) {
        throw new Error(
          `Invalid duration "${duration}", accepted values are ${acceptedDurations.join(
            ", "
          )}`
        );
      }
    } else {
      duration = "1h";
    }

    const { buffer, metadata } = await ClientFileService.getFileFromClient(
      path
    );

    const data = new FormData();
    data.set("reqtype", "fileupload");
    data.set("fileToUpload", new Blob([buffer]), metadata.filename);
    data.set("time", duration);

    console.log("uploadFile CATBOX REQ", data);

    const init: RequestInit = {
      method: "POST",
      headers: {
        "user-agent": USER_AGENT,
      },
      body: data,
      mode: "cors",
      credentials: "omit",
    };

    if (litterboxChannels.create.hasSubscribers) {
      litterboxChannels.create.publish({ request: init });
      console.log("uploadFile CATBOX REQ SUBS", init);
    }

    // Remove this Node.js specific code
    // subscribe(kCatboxRequestCreate, (data: any) => {
    //   const request: RequestInit = data.request;
    //   console.log(request);
    // });
    console.log("uploadFile CATBOX REQ INIT", init);
    const res = await fetch(LITTERBOX_API_ENDPOINT, init);
    if (!res.ok) {
      console.log("uploadFile CATBOX ERR", res);
      throw new Error(res.statusText);
    }

    const text = await res.text();
    if (text.startsWith("https://litter.catbox.moe/")) {
      return text;
    } else {
      throw new Error(text);
    }
  }
}

export const litterbox = new Litterbox();
