export class ContributionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ContributionError";
    }
}
