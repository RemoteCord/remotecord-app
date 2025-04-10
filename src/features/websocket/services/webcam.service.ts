import { invoke } from "@tauri-apps/api/core";

export class WebcamService {
  static listAllWebcams = async () => {
    try {
      const webcams = await invoke("get_webcams");
      console.log("webcams", webcams);
      return webcams;
    } catch (error) {
      console.error("listAllWebcams", error);
      throw error;
    }
  };

  static makeScreenshotWebcam = async (webcam_index: number) => {
    try {
      const screenshot = await invoke("capture_webcam_screenshot", {
        index: webcam_index,
      });
      console.log("screenshot", screenshot);
      return screenshot;
    } catch (error) {
      console.error("makeScreenshotWebcam", error);
      throw error;
    }
  };
}
