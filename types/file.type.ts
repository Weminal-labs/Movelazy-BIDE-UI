export type File = {
    id: string;
    name: string;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
    isDirty: boolean; // unsaved file
};

export type FileFolder = 'contracts' | 'scripts' | 'tests';