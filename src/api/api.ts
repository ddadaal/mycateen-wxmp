import type { CategoryId } from "@/components/CategorySelector";
import { request } from "@remax/wechat";

export enum Flavor {
  Spicy = "Spicy",
  Sour = "Sour",
  Sweet = "Sweet",
  Bitter = "Bitter"
}
export enum Canteen {
  XueYi = "XueYi",
  JiaYuan1 = "JiaYuan1",
  JiaYuan2 =  "JiaYuan2",
  JiaYuan3 =  "JiaYuan3",
  JiaYuan4 =  "JiaYuan4",
  NongYuan1 =  "NongYuan1",
  NongYuan2 =  "NongYuan2",
  NongYuan3 =  "NongYuan3",
}


export interface DishSearchResult {
  id: number;
  "name": string,
  "price": number,
  "canteen": Canteen,
  "calorie": number,
  "rate": number;
  "rateNumber": number,
  "pictureUrl": string;
}

export interface SearchDishQuery {
  name?: string;
  category?: CategoryId;
  canteen?: Canteen;
  price?: number;
  flavors?: Flavor[];
  ingredients?: string[];
  maxCalorie?: number;
  waitTime?: number;
  page?: number;
}

const callCount = 0;

const apiRoot = "http://139.198.171.207:2543";

export const apis = {
  searchDishes: async (query: SearchDishQuery) =>  {
    // return await request({ url: apiRoot + "/dishes/getList" });

    return {
      results: [
        {
          calorie: 32,
          name: "番茄炒蛋",
          price: 3,
          canteen: Canteen.JiaYuan1,
          rate: 4,
          rateNumber: 1333,
          pictureUrl: "/images/dishitem/example.png",
        },
      ],
    };


  },
};
