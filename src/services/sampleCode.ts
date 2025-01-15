import { File } from '@/types/file.type';

export async function loadSampleCode(): Promise<File[]> {
    const sampleFiles = [
        {
            path: 'contracts/Move.toml',
            url: '/code_sample/hello/Move.toml'
        },
        {
            path: 'contracts/sources/hello.move',
            url: '/code_sample/hello/sources/hello.move'
        }
    ];

    const now = new Date();
    const files: File[] = await Promise.all(
        sampleFiles.map(async (file) => {
            const response = await fetch(file.url);
            const content = await response.text();
            return {
                id: crypto.randomUUID(),
                name: file.path,
                content,
                isDirty: false,
                createdAt: now,
                updatedAt: now
            };
        })
    );

    return files;
}