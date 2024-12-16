export class classroomObject {
    constructor(
        public readonly db: string,

        public readonly title: string,
        public readonly content: string,
        public readonly filePath: string,
        public readonly classCode: string,
        public readonly message: string,
        public readonly tag: string,
        public readonly fileName: string,
        public readonly originalPath: string
    ) { }
}
