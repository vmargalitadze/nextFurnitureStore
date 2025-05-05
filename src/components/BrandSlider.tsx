import React from 'react';
import './slider.css';
import Image from 'next/image';
import one from '../../public/logos/1.png';
import two from '../../public/logos/2.png';
import three from '../../public/logos/3.png';
import four from '../../public/logos/4.png';
import five from '../../public/logos/5.png';
import six from '../../public/logos/6.png';
import BrandItem from './BrandItem';

const logos = [
  one.src,
  two.src,
  three.src,
  four.src,
  five.src,
  six.src,
];

function BrandSlider() {
  return (
    <div className="s-py-100-50">
      <div className="mx-au">
        <div className="flex justify-center items-center mb-[40px] md:mb-[52px]">
          <span className="text-primary font-secondary font-normal text-3xl md:text-[60px] block sm:-mb-[30px] leading-normal sm:leading-normal">
            პარტნიორები
          </span>
        </div>

        <BrandItem  images={logos} from={0} to={"-100%"} />
      </div>
    </div>
  );
}

export default BrandSlider;
