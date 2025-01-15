export type File = {
    readonly id: string;
    name: string;
    content?: string;
    readonly createdAt: Date;
    updatedAt: Date;
    isDirty: boolean; // unsaved file
};

export type FileFolder = 'contracts' | 'scripts' | 'tests';