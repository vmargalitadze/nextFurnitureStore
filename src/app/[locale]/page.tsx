import BrandSlider from "@/components/BrandSlider";
import Categories from "@/components/Categories";
import ProductList from "@/components/ProductList";

import Hero from "@/components/Slider";

const HomePage = () => {
  return (
    <>
      <Hero />
      <BrandSlider />

      <ProductList />
      <Categories />
    </>
  );
};

export default HomePage;
