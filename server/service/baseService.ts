export class BaseService<T> {
    private model: any;

    constructor(model: any) {
        this.model = model;
    }

    async findMany(): Promise<T[]> {
        return await this.model.findMany();
    }

    async findUnique(id: number): Promise<T | null> {
        return await this.model.findUnique({
            where: {id},
        });
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        return await this.model.create({
            data,
        });
    }

    async update(id: number, data: Partial<T>): Promise<T> {
        return await this.model.update({
            where: {id},
            data,
        });
    }

    async delete(id: number): Promise<T> {
        return await this.model.delete({
            where: {id},
        });
    }
}
