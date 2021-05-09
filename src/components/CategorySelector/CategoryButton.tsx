import { View, Image } from "@remax/wechat";
import classnames from "classnames";
import React from "react";
import type { Category } from ".";
import styles from "./index.css";

const toImageUrl = (id: string) =>
  `/images/categories/${id}.png`;

interface Props {
  category: Category;
  selected?: boolean;
  onSelect?: (c: Category) => void;
}

export const CategoryButton: React.FC<Props> = ({
  category,
  selected,
  onSelect,
}) => {
  return (
    <View
      className={classnames(styles.container, { [styles.selected]: selected })}
      onClick={() => onSelect?.(category)}
    >
      <View className={styles.circle}>
        <Image className={styles.image} src={toImageUrl(category.id)} />
      </View>
      <View className={styles.text}>
        {category.text}
      </View>
    </View>
  );
};
