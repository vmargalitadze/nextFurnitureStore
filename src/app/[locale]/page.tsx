import BrandSlider from "@/components/BrandSlider";
import Categories from "@/components/Categories";
import ProductList from "@/components/ProductList";

import Slider from "@/components/Slider";


const HomePage = () => {
 
  return (
    <>
      <Slider />

      <ProductList  />
      <Categories />

    <BrandSlider />
    </>
  );
};

export default HomePage;
