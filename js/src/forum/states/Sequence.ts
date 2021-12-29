export default class Sequence {
    frames: number[][] = []

    constructor(csv: string) {
        csv.split('\n').forEach(frame => {
            // Ignore empty lines
            if (!frame) {
                return;
            }

            const columns = frame.split(',');

            // Skip header line
            if (columns[0] === 'FRAME_ID') {
                return;
            }

            let color = 0;
            const frameColors: number[] = [];

            columns.forEach((value, index) => {
                // index 0 is frame number, ignoring for now
                if (index === 0) {
                    return;
                }

                const numberValue = parseInt(value);

                // -1 for index without frame number
                switch ((index - 1) % 3) {
                    case 2: // B
                        color = color | numberValue;
                        frameColors.push(color);
                        break;
                    case 1: // G
                        color = color | (numberValue << 8);
                        break;
                    case 0: // R
                        color = numberValue << 16;
                        break;
                }
            });

            this.frames.push(frameColors);
        });
    }

    getFrame(index: number): number[] {
        return this.frames[index] || [];
    }

    getFrameCount() {
        return this.frames.length;
    }
}
