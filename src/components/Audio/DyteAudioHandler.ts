interface PeerAudio {
    id: string;
    track: MediaStreamTrack;
}

export default class DyteAudioHandler {
    private audio: HTMLAudioElement;
    private audioStream: MediaStream;

    private audioTracks: PeerAudio[];

    private _onError: (() => void) | null = null;

    constructor() {
        this.audio = document.createElement('audio');
        this.audio.autoplay = true;

        this.audioStream = new MediaStream();
        this.audio.srcObject = this.audioStream;

        this.audioTracks = [];
    }

    addTrack(id: string, track: MediaStreamTrack) {
        if (!this.audioTracks.some((a) => a.id === id)) {
            this.audioTracks.push({ id, track });
            this.audioStream.addTrack(track);

            this.play();
        }
    }

    removeTrack(id: string) {
        const track = this.audioTracks.find((a) => a.id === id);
        if (track != null) {
            this.audioStream.removeTrack(track.track);
            this.audioTracks = this.audioTracks.filter((a) => a.id !== id);
        }
    }

    async play() {
        // need to do both srcObject and play() for it work on all browsers
        this.audio.srcObject = this.audioStream;
        await this.audio.play()?.catch((err) => {
            if (err.name === 'NotAllowedError') {
                if (this._onError != null) {
                    this._onError();
                }
            } else if (err.name !== 'AbortError') {
                console.error('[dyte-audio] play() error\n', err);
            }
        });
    }

    async setDevice(id: string) {
        await (this.audio as any).setSinkId?.(id)?.catch((err: Error) => {
            console.error('[dyte-audio] setSinkId() error\n', err);
        });
    }

    onError(onError: () => void) {
        this._onError = onError;
    }
}
