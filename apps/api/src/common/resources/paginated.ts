export class Paginated<TItem> {
  constructor(
    public readonly items: TItem[],
    public readonly total: number,
    public readonly page: number,
    public readonly perPage: number,
  ) {}
}
