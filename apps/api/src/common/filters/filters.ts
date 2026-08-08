export class Filters<TWhere extends object> {
  private readonly parts: TWhere[] = [];

  public static init<TWhere extends object>(): Filters<TWhere> {
    return new Filters<TWhere>();
  }

  public add(part: TWhere): this {
    this.parts.push(part);

    return this;
  }

  public when<TValue>(value: TValue | null | undefined, part: (value: TValue) => TWhere): this {
    return value === null || value === undefined ? this : this.add(part(value));
  }

  public build(): { AND: TWhere[] } {
    return { AND: this.parts };
  }
}
