import React, { useEffect, useRef } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { ScrollView, View } from "@remax/wechat";
import styles from "./index.css";
import { FilterRow, PriceRange } from "./components/FilterRow";
import { PositionRow } from "./components/PositionRow";
import { apis, DishSearchResult, SearchDishQuery } from "@/api/api";
import { DishItem } from "../../components/DishItem";
import { Loading, SearchBar } from "annar";
import { CategorySelector } from "@/components/CategorySelector";
import { useLoading } from "@/utils/hooks";
import { readAndClearGlobal } from "@/utils/globals";
import { usePageEvent } from "remax/macro";

type PagelessQuery = Omit<SearchDishQuery, "page">;

function navigateToDish(
  dish: DishSearchResult,
  updateDishHandler?: (d: DishSearchResult) => void,
) {
  wx.navigateTo({
    url:
        "/pages/reviews/index?dish=" + JSON.stringify(dish),
    events: { "updateDish": updateDishHandler },
  });
}

export default () => {

  const page = useRef(1);
  const [query, setQuery] =
  React.useState({ canteen: readAndClearGlobal("indexPageCanteen") } as PagelessQuery);


  const [loading, setLoading] = useLoading();
  const [results, setResults] = React.useState([] as DishSearchResult[]);
  const [refresherTriggered, setRefresherTriggered] = React.useState(false);
  const hasMore = useRef(true);

  const update = async (query: PagelessQuery) => {
    setQuery(query);
    setLoading(true);
    setResults([]);
    page.current = 1;
    const resp = await apis.searchDishes({ ...query, page: page.current });
    setResults(resp);
    setLoading(false);
    setRefresherTriggered(false);
  };

  usePageEvent("onShow", () => {
    const value = readAndClearGlobal("indexPageCanteen");
    if (value) {
      update({ canteen: value });
    }
  });

  const onMore = async () => {
    if (loading || !hasMore.current) {
      return;
    }
    setLoading(true);
    page.current++;
    const resp = await apis.searchDishes({ ...query, page: page.current });
    if (resp.length === 0) {
      hasMore.current = false;
    } else {
      setResults([...results, ...resp]);
    }
    setLoading(false);
  };

  useEffect(() => {
    update(query);
  }, []);

  const onRandomClicked = () => {
    // randomly select one from results
    const r = Math.random();
    const i = Math.floor(r * results.length);
    const dish = results[i];
    navigateToDish(dish);
  };


  return (
    <MainLayout>
      <View className={styles.content}>
        <View className={styles.filters}>
          <SearchBar
            value={query.name}
            placeholder="今天想吃点什么"
            onInput={(v) => update({ ...query, name: v })}
            onClear={() => update({ ...query, name: "" })}
          />
          <CategorySelector
            selected={query.category}
            onSelect={(c) => {
              if (query.category === c.id) {
                update({ ...query, category: undefined });
              } else {
                update({ ...query, category: c.id });
              }
            }}
          />
          <PositionRow
            onRandomClicked={onRandomClicked}
            randomEnabled={results.length>0}
          />
          <FilterRow
            canteen={query.canteen}
            onCanteenChange={(c) => update({ ...query, canteen: c })}
            flavor={query.flavors?.[0]}
            onFlavorChange={(f) => update({ ...query, flavors: f ? [f] : undefined })}
            price={query.minPrice
              ? [query.minPrice, query.maxPrice!] as PriceRange
              : undefined}
            onPriceChange={(p) =>
              update({ ...query, minPrice: p ? p[0] : undefined, maxPrice: p ? p[1] : undefined })}
            calorie={query.maxCalorie}
            onCalorieChange={(c) => update({ ...query, maxCalorie: c })}
          />
        </View>
        <View className={styles["dishes-list"]}>
          <ScrollView
            style={{ height: "100%" }}
            scrollY
            onScrollToLower={onMore}
            refresherEnabled
            onRefresherRefresh={() => {
              setRefresherTriggered(true);
              update(query);
            }}
            refresherTriggered={refresherTriggered}
          >
            {
              (results.length > 0)
                ? results.map((x) => (
                  <DishItem key={x.dishId} dish={x}
                    onClick={() => navigateToDish(
                      x,
                      (r) => {
                        // change the corresponding Dish
                        const d = results.findIndex((i) => i.dishId === r.dishId);
                        if (d >=0) {
                          console.log(`rewrite item in ${d}`);
                          setResults([
                            ...results.slice(0, d),
                            r,
                            ...results.slice(d+1),
                          ]);
                        }

                      }
                    )}
                  >
                        查看详情
                  </DishItem>
                ))
                : loading
                  ? <Loading />
                  : undefined
            }
          </ScrollView>
        </View>
      </View>
    </MainLayout>
  );
};
