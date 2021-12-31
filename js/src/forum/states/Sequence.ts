export default class Sequence {
    frames: number[][] = []

    constructor(csv: string) {
        let columnCount: number;
        let expectedFrameNumber: number = 0;

        csv.split('\n').forEach((frame, rowIndex) => {
            // Ignore empty lines
            if (!frame) {
                return;
            }

            const columns = frame.split(',');

            if (!columnCount) {
                columnCount = columns.length;
            }

            if (columns.length !== columnCount) {
                throw new Error('Line ' + (rowIndex + 1) + ' of CSV file has ' + columns.length + ' columns instead of expected ' + columnCount);
            }

            const firstColumnIntValue = parseInt(columns[0]);

            // Skip header line (check if first values is text instead of integer)
            if (columns[0] !== firstColumnIntValue + '') {
                return;
            }

            if (firstColumnIntValue !== expectedFrameNumber) {
                throw new Error('Skipping frames not supported (Line ' + (rowIndex + 1) + ', expected frame number ' + expectedFrameNumber + ', got ' + firstColumnIntValue + ')');
            }

            let color = 0;
            const frameColors: number[] = [];

            columns.forEach((value, columnIndex) => {
                // index 0 is frame number, ignoring for now
                if (columnIndex === 0) {
                    return;
                }

                const numberValue = parseInt(value);

                if (isNaN(numberValue) || numberValue < 0 || numberValue > 255) {
                    throw new Error('Invalid color value ( ' + value + ') on line ' + (rowIndex + 1) + ', column ' + (columnIndex + 1));
                }

                // -1 for index without frame number
                switch ((columnIndex - 1) % 3) {
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

            expectedFrameNumber++;
        });
    }

    getFrame(index: number): number[] {
        return this.frames[index] || [];
    }

    getFrameCount() {
        return this.frames.length;
    }
}
