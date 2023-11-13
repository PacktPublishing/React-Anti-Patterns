import { useEffect, useState } from "react";
import { RemoteMenuItem } from "../models/RemoteMenuItem";
import { IMenuItem } from "../models/IMenuItem";
import { BaseMenuItem } from "../models/BaseMenuItem";

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const result = await fetch(
        "https://gist.githubusercontent.com/abruzzi/3dcb7424d635817b2de9323469dfdca3/raw/ff8fc90eb43d688af82f70aa37b9d674a106c931/pizzas.json"
      );
      const menuItems = await result.json();

      setMenuItems(
        menuItems.map((item: RemoteMenuItem) => {
          return new BaseMenuItem(item);
        })
      );
    };

    fetchMenuItems();
  }, []);

  return { menuItems };
};
