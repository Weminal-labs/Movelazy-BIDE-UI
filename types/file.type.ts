export type File = {
    id: string;
    name: string;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
};

export type FileFolder = 'contracts' | 'scripts' | 'tests';