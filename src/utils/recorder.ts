export class Recorder {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  constructor(private readonly constraints: MediaStreamConstraints) {}

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    this.recorder = new MediaRecorder(this.stream);
    this.chunks = [];

    this.recorder.addEventListener('dataavailable', this.handleDataAvailable);

    this.recorder.start();
  }

  stop() {
    return new Promise<Blob>((resolve, reject) => {
      const recorder = this.recorder;
      const stream = this.stream;
      if (!recorder || !stream) {
        reject(new Error('Recorder not started'));
        return;
      }

      const handleStop = () => {
        const blob = new Blob(this.chunks, {
          type: recorder.mimeType,
        });

        this.stream = null;
        this.recorder = null;
        this.chunks = [];

        recorder.removeEventListener('stop', handleStop);
        recorder.removeEventListener('dataavailable', this.handleDataAvailable);

        resolve(blob);
      };

      recorder.addEventListener('stop', handleStop);

      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });
  }

  private handleDataAvailable = (e: BlobEvent) => {
    this.chunks.push(e.data);
  };
}
