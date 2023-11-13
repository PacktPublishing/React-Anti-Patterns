import { BaseMenuItem } from "./BaseMenuItem";
import { RemoteMenuItem } from "./RemoteMenuItem";

export class PastaItem extends BaseMenuItem {
  private readonly servingSize: string;

  constructor(item: RemoteMenuItem, servingSize: string) {
    super(item);
    this.servingSize = servingSize;
  }
}
