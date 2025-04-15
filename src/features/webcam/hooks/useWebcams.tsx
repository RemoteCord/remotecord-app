export const useWebcams = () => {
  const listWebcams = async () => {
    try {
      const webcams = (await navigator.mediaDevices.enumerateDevices())
        .map((device) => ({
          id: device.deviceId,
          name: device.label,
          type: device.kind,
        }))
        .filter(
          (device) =>
            device.type !== "audioinput" && device.type !== "audiooutput"
        )
        .map((device) => ({
          id: device.id,
          name: device.name,
        }));
      console.log("webcams", webcams);
      return webcams;
    } catch (error) {
      console.error("listWebcams", error);
      throw error;
    }
  };

  const setupCamera = async (webcamId: string) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Available cameras:", videoDevices, webcamId);

      const selectedCamera = videoDevices.find(
        (device) => device.deviceId === webcamId
      );

      console.log("Selected camera:", selectedCamera);

      if (!selectedCamera) {
        throw new Error("No video devices found");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedCamera.deviceId } },
      });

      const video = document.getElementById("camera") as HTMLVideoElement;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }

      return video;
    } catch (error) {
      console.error("Error accessing the camera: ", error);
      throw error;
    }
  };

  const takeScreenshotWebcam = async (webcamId: string) => {
    // Take a picture

    const video = await setupCamera(webcamId);
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      console.log("Captured image:", imageDataUrl);
      // You can return or use imageDataUrl as needed
      return imageDataUrl;
    }
  };

  return {
    listWebcams,
    setupCamera,
    takeScreenshotWebcam,
  };
};
