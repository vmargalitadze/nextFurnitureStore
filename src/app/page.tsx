import Categories from "@/components/Categories";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <>
      <Slider />

      <ProductList />
      <Categories />

    </>
  );
};

export default HomePage;
